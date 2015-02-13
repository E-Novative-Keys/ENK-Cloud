<?php $title_for_layout = 'Cloud | ENK-Cloud'; ?>
<h1>Page de Cloud</h1>
<?php echo var_dump($this->Session->read()); ?>
<br/>
<?php echo $this->Html->link('Logout', array('controller' => 'users', 'action' => 'logout')); ?>