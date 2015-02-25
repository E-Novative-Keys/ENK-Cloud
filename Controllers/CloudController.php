<?php

class CloudController extends Controller
{
	public function beforeFilter()
	{
		parent::beforeFilter();
		
		$this->Auth->authorized('client');

		$this->layout = 'cloud';
	}

	public function index()
	{
		
	}
}

?>