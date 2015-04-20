<?php

class MailsController extends Controller
{
	public function beforeFilter()
	{
		parent::beforeFilter();
		
		$this->Auth->authorized('client');

		$this->layout = 'cloud';

		if($this->Auth->deny)
			$this->redirect(array('controller' => 'users', 'action' => 'login'));
	}

	public function index() {}

	public function sent() {}

	public function add()
	{
		if(isset($this->request->data) && !empty($this->request->data))
		{
			if($this->Mail->validates($this->request->data))
			{
				$this->request->data['Token']['link'] 		= $this->Session->read('Token.link');
				$this->request->data['Token']['fields'] 	= $this->Session->read('Token.fields');

				$send = json_decode($this->curl("http://enkwebservice.com/mailbox/new", $this->request->data), true);
				
				if(isset($send['email']))
				{
					$this->Session->setFlash('Votre message a bien été envoyé', 'success');
					die($this->redirect(array('controller' => 'mails', 'action' => 'index')));
				}
				else
					$this->Session->setFlash($send, 'error');
			}
		}
	}
}

?>