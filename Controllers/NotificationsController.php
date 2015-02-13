<?php

class NotificationsController extends Controller
{
	public function beforeFilter()
	{
		parent::beforeFilter();

		$this->Auth->authorized('client');
	}

	public function index()
	{
		$this->request->data['Token'] = $this->Session->read('Token');

		/*
		$clientNotifications = $this->curl('http://enkcloud.com/notifications', $this->request->data);

		$this->set(compact('clientNotifications'));
		*/
	}
}

?>