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
		$this->request->data['Token'] = $this->Session->read('Token');

		/*
		$clientFiles = $this->curl('http://enkcloud.com/cloud/files/clients', $this->request->data);
		$devFiles = $this->curl('http://enkcloud.com/cloud/files/devs', $this->request->data);

		$this->set(compact('clientsFiles', 'devFiles'));
		*/
	}
}

?>