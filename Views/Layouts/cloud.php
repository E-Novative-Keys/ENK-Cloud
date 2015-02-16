<?php echo $this->Html->doctype(); ?>
<html>
<head>
	<title><?php echo ($title_for_layout) ? $title_for_layout : 'Page'; ?></title>
	<?php echo $this->Html->charset(); ?>
	<?php echo $this->Html->meta('viewport', 'width=device-width, initial-scale=1.0'); ?>
	<?php echo $this->Html->meta('icon', 'img/favicon.ico'); ?>
	
	<?php echo $this->Html->layout('meta'); ?>
</head>
<body>
	<?php echo $this->Html->css('bootstrap', true); ?>

	<?php echo $this->Html->layout('css'); ?>

	<?php echo $this->Session->flash(); ?>

	<?php echo $content_for_layout; ?>

	<?php echo $this->Html->script('jquery-1.11.2.min', true); ?>
	<?php echo $this->Html->script('bootstrap.min', true); ?>
	
	<?php echo $this->Html->layout('js'); ?>
</body>
</html>