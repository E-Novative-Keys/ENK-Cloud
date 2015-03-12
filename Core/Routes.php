<?php

Router::connect('/', array('controller' => 'users', 'action' => 'login'));

Router::connect('/logout', array('controller' => 'users', 'action' => 'logout'));

Router::connect('/cloud', array('controller' => 'cloud', 'action' => 'index'));

Router::connect('/notifications', array('controller' => 'notifications', 'action' => 'index'));

Router::connect('/mailbox', array('controller' => 'messages', 'action' => 'index'));
Router::connect('/mailbox/sent-mail', array('controller' => 'messages', 'action' => 'sent'));
Router::connect('/mailbox/new', array('controller' => 'messages', 'action' => 'add'));

Router::connect('/config/:token',
	array('controller' => 'users', 'action' => 'configPassword'),
	array('token' => '[a-z0-9]+')
);

?>