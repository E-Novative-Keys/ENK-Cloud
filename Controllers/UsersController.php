<?php

class UsersController extends Controller
{
	public function beforeFilter()
	{
		parent::beforeFilter();
		$this->Auth->allow(array('login', 'configPassword'));
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
			$this->redirect(array(
				'controller' => 'cloud',
				'action'	 => 'index'
			));
	}

	public function logout()
	{
		if($this->Auth->isLogged())
		{
			$this->Auth->logout();
			$this->redirect(array(
				'controller' => 'users',
				'action'	 => 'login'
			));
		}
		
	}

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
			if(isset($this->request->data['Client']['password']) && !empty($this->request->data['Client']['password']) 
			&& isset($this->request->data['Client']['confirm']) && !empty($this->request->data['Client']['confirm']))
			{
				if($this->request->data['Client']['password'] == $this->request->data['Client']['confirm'])
				{	
					$this->request->data['Client']['email'] 		= $this->Session->read('Client.email');				
					$this->request->data['Client']['lastname'] 		= $this->Session->read('Client.lastname');
					$this->request->data['Client']['firstname'] 	= $this->Session->read('Client.firstname');
					$this->request->data['Client']['address'] 		= $this->Session->read('Client.address');
					$this->request->data['Client']['siret'] 		= $this->Session->read('Client.siret');
					$this->request->data['Client']['phonenumber'] 	= $this->Session->read('Client.phonenumber');
					$this->request->data['Client']['enterprise'] 	= $this->Session->read('Client.enterprise');
					$this->request->data['Client']['password'] 		= $this->Auth->password($this->request->data['Client']['password']);
					unset($this->request->data['Client']['confirm']);
					$this->request->data['Client']['token_email'] 	= $this->Session->read('Client.token_email');
					
					$this->request->data['Token']['link'] 			= base64_encode($this->Session->read('Client.email'));
					$this->request->data['Token']['fields'] 		= $this->Session->read('Client.token');

					$this->curl('http://enkwebservice.com/clients/edit/'.$this->Session->read('Client.id'), $this->request->data);
					$this->Session->setFlash('Votre mot de passe a été initialisé', 'success');
					die($this->redirect(array('controller' => 'users', 'action' => 'login')));
				}
			}
		}
	}
}

?>