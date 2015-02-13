<?php

class MessagesController extends Controller
{
	public function beforeFilter()
	{
		parent::beforeFilter();
		
		$this->Auth->authorized('client');
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