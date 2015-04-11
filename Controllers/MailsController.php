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

	public function index()
	{

	}

	public function sent()
	{

	}

	public function add()
	{

	}
}

?>