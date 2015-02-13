<?php

class CloudController extends Controller
{
	public function beforeFilter()
	{
		parent::beforeFilter();
		$this->Auth->authorized('client');
	}

	public function index()
	{

	}
}

?>