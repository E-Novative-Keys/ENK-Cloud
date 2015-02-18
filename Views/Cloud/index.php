<?php header("Access-Control-Allow-Origin: *"); ?>
<?php $title_for_layout = 'Cloud | ENK-Cloud'; ?>
<?php echo $this->Html->script('cloud'); ?>

<h1>Page de Cloud</h1>
<?php echo var_dump($this->Session->read()); ?>
<br/>
<br/>
<div id="client_files"></div>
<div id="dev_files"></div>
<br/>
<?php echo $this->Html->link('Logout', array('controller' => 'users', 'action' => 'logout')); ?>

<?php 
	echo $this->Form->input('Token.link', array(
		'type' 	=> 'hidden',
		'id'	=> 'link',
		'value' => $this->Session->read('Token.link')
	));
?>
<?php 
	echo $this->Form->input('Token.fields', array(
		'type' 	=> 'hidden',
		'id'	=> 'fields',
		'value' => $this->Session->read('Token.fields')
	));
?>