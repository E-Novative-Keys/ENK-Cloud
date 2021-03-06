<?php

class UsersController extends Controller
{
	public function beforeFilter()
	{
		parent::beforeFilter();
		$this->Auth->allow(array('login', 'configPassword'));

		if($this->request->action == 'profile')
			$this->layout = 'cloud';
	}

	public function login()
	{
		if(!$this->Auth->isLogged())
		{
			if(isset($this->request->data) && !empty($this->request->data))
			{
				if($this->User->validates($this->request->data) && $this->Auth->login())
					$this->redirect(array(
						'controller' => 'cloud',
						'action'	 => 'index'
					));
				else
					$this->Session->setFlash('Informations non valides', 'error');
			}
		}
		else
			$this->redirect(array('controller' => 'cloud', 'action' => 'index'));
	}

	public function logout()
	{
		if($this->Auth->isLogged())
		{
			$this->Auth->logout();
			$this->redirect(array('controller' => 'users', 'action' => 'login'));
		}	
	}

	/**
	* Configuration du password après avoir reçu un email de création de compte ou de forgot password
	*/
	public function configPassword($token = null)
	{
		$post = array("Client" => array("token" => $token));
		
		if(($user = $this->curl("http://enkwebservice.com/users/validate", $post)) == null)
		{
			$this->redirect(array('controller' => 'users', 'action' => 'login'));
			$this->Session->setflash('Invalid Token', 'error');
		}
		else
		{
			$this->Session->write('Client', json_decode($user, true)['user']);
			$this->set(compact("user"));
		}

		if(isset($this->request->data) && !empty($this->request->data))
		{
			if(!isset($this->request->data['Client']['password']) || empty($this->request->data['Client']['password']) 
			|| !isset($this->request->data['Client']['confirm'])  || empty($this->request->data['Client']['confirm']))
				die();

			if($this->request->data['Client']['password'] == $this->request->data['Client']['confirm'])
			{	
				if(strlen($this->request->data['Client']['password']) >= 6)
				{
					unset($this->request->data['Client']['confirm']);

					$this->request->data['Client']['id'] 			= $this->Session->read('Client.id');	
					$this->request->data['Client']['email'] 		= $this->Session->read('Client.email');				
					$this->request->data['Client']['lastname'] 		= $this->Session->read('Client.lastname');
					$this->request->data['Client']['firstname'] 	= $this->Session->read('Client.firstname');
					$this->request->data['Client']['address'] 		= $this->Session->read('Client.address');
					$this->request->data['Client']['siret'] 		= $this->Session->read('Client.siret');
					$this->request->data['Client']['phonenumber'] 	= $this->Session->read('Client.phonenumber');
					$this->request->data['Client']['enterprise'] 	= $this->Session->read('Client.enterprise');
					$this->request->data['Client']['password'] 		= $this->Auth->password($this->request->data['Client']['password']);
					$this->request->data['Client']['token_email'] 	= $this->Session->read('Client.token_email');
					
					$this->request->data['Token']['link'] 			= base64_encode($this->Session->read('Client.email'));
					$this->request->data['Token']['fields'] 		= $this->Session->read('Client.token');

					$this->curl('http://enkwebservice.com/clients/edit/', $this->request->data);
					
					$this->Session->setFlash('Votre mot de passe a été initialisé', 'success');
					die($this->redirect(array('controller' => 'users', 'action' => 'login')));
				}
				// Si le mot de passe fait moins de 6 caractères
				else
					$this->Session->setFlash('Votre mot de passe doit contenir au moins 6 caractères', 'error');
			}
		}
	}

	public function profile()
	{
		if(isset($this->request->data) && !empty($this->request->data))
		{
			if(isset($this->request->data['User']['oldpass'])
			&& isset($this->request->data['User']['password'])
			&& isset($this->request->data['User']['confirm']))
			{
				if($this->request->data['User']['password'] == $this->request->data['User']['confirm'])
				{
					if(strlen($this->request->data['User']['password']) >= 6)
					{
						$this->request->data['Client']['id'] 			= $this->Session->read('User.id');	
						$this->request->data['Client']['email'] 		= $this->Session->read('User.email');				
						$this->request->data['Client']['lastname'] 		= $this->Session->read('User.lastname');
						$this->request->data['Client']['firstname'] 	= $this->Session->read('User.firstname');
						$this->request->data['Client']['address'] 		= $this->Session->read('User.address');
						$this->request->data['Client']['siret'] 		= $this->Session->read('User.siret');
						$this->request->data['Client']['phonenumber'] 	= $this->Session->read('User.phonenumber');
						$this->request->data['Client']['enterprise'] 	= $this->Session->read('User.enterprise');
						$this->request->data['Client']['password'] 		= $this->Auth->password($this->request->data['User']['password']);
						$this->request->data['Client']['oldpass'] 		= $this->Auth->password($this->request->data['User']['oldpass']);

						$this->request->data['Token']['link'] 			= $this->Session->read('Token.link');
						$this->request->data['Token']['fields'] 		= $this->Session->read('Token.fields');

						unset($this->request->data['User']);

						$result = $this->curl('http://enkwebservice.com/clients/update/', $this->request->data);
						$result = json_decode($result, true);

						if(isset($result['error']))
							$this->Session->setFlash($result['error'], 'error');
						else
							$this->Session->setFlash('Votre mot de passe a bien été mis à jour', 'success');
					}
					// Si le mot de passe fait moins de 6 caractères
					else
						$this->Session->setFlash('Votre mot de passe doit contenir au moins 6 caractères', 'error');
				}
				else
					$this->Session->setFlash('Les mots de passe ne correspondent pas', 'error');
			}
			else
				$this->Session->setFlash('Veuillez compléter tous les champs', 'error');
		}
	}
}

?>