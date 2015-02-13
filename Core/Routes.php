<?php

Router::connect('', array('controller' => 'users', 'action' => 'login'));
Router::connect('cloud', array('controller' => 'cloud', 'action' => 'index'));

?>