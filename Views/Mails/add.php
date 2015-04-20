<?php $title_for_layout = 'Nouveau message | ENK-Cloud'; ?>

<?php echo $this->Html->css('mails'); ?>

<?php echo $this->Html->script('mailsManager'); ?>
<?php echo $this->Html->script('listProjects'); ?>

<section>
	<div class="row">
		<div class="col-md-6 col-md-offset-4">
			<div class="well well-sm">
			<?php echo $this->Form->create(array('class' => 'form-horizontal')); ?>
				<fieldset>
					<legend class="text-center">Nouveau message</legend>

					<div class="form-group">
						<label class="col-md-3 control-label" for="inputObject">Objet</label>
						<div class="col-md-9">
							<?php 
								echo $this->Form->input('Mail.object', array(
									'type'			=> 'text',
									'class' 		=> 'form-control',
									'id'			=> 'inputObject',
									'required' 		=> 'required',
									'placeholder'	=> 'Objet du message'
								));
							?>
						</div>
					</div>

					<div class="form-group">
						<label class="col-md-3 control-label" for="inputMail">Message</label>
						<div class="col-md-9">
							<?php 
								echo $this->Form->input('Mail.content', array(
									'type'			=> 'textarea',
									'class' 		=> 'form-control',
									'id'			=> 'inputMail',
									'required' 		=> 'required',
									'placeholder'	=> 'Message',
									'rows'			=> 15
								));
							?>
						</div>
					</div>
					<?php
						echo $this->Form->input("Mail.project", array(
							'type' 	=> 'hidden',
							'value' => 'MQ=='
						));
					?>
					<div class="form-group">
						<div class="col-md-12 text-right">
							<?php echo $this->Form->submit(array('class' => 'btn btn-primary btn-lg')); ?>
						</div>
					</div>
				</fieldset>
			<?php echo $this->Form->end(); ?>
			</div>
		</div>
	</div>
</section>