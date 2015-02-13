<?php

class UsersController extends Controller
{
	public function beforeFilter()
	{
		parent::beforeFilter();
		$this->Auth->allow('login');
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
					$this->Session->setFlash('error', 'Informations non valides');
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
}

?>