<?php $title_for_layout = 'Connexion | ENK-Cloud'; ?>
<?php echo $this->Html->css('login'); ?>
<?php echo $this->Html->script('login'); ?>
<?php echo $this->Html->script('TweenLite.min'); ?>

<div class="container">
	<div class="row vertical-offset-100">
		<div class="col-md-4 col-sm-6 col-xs-12 col-md-offset-4 col-sm-offset-3">
			<div class="panel panel-default">
				<div class="panel-heading logo">
					<?php 
						echo $this->Html->image('logo.png', array(
							'alt' 		=> 'Logo ENK',
							'width' 	=> '250',
							'height' 	=> '100'
						));
					?>
				</div>
				<div class="panel-body">
					<?php echo $this->Form->create(); ?>
						<fieldset>
							<div class="form-group">
								<?php 
									echo $this->Form->input('User.email', array(
										'type' 			=> 'email',
										'placeholder' 	=> 'E-mail',
										'required'		=> 'required',
										'class' 		=> 'form-control'
									));
								?>
							</div>
							<div class="form-group">
								<?php 
									echo $this->Form->input('User.password', array(
										'type' 			=> 'password',
										'placeholder' 	=> 'Password',
										'required'		=> 'required',
										'class' 		=> 'form-control'
									));
								?>
							</div>
							<div class="checkbox">
								<label>
									<?php echo $this->Html->link('Forgot password ?', '#'); ?>
								</label>
							</div>
							<?php 
								echo $this->Form->submit(array(
									'value' => 'Login',
									'class' => 'btn btn-lg btn-block btn-submit'
								));
							?>
						</fieldset>
					<?php echo $this->Form->end(); ?>
				</div>
			</div>
		</div>
	</div>
</div>