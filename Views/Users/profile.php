<?php $title_for_layout = 'Mon profil | ENK-Cloud'; ?>
<?php echo $this->Html->css('profile'); ?>

<section id="profile" class="jumbotron">
	<div class="container">
		<div class="row">
	        <div class="col-xs-12 col-md-6">
	            <div class="panel panel-default">
	                <div class="panel-heading">
	                	<h4>À propos</h4>
	                </div>
	                <div class="panel-body">
	                    <p>
	                    	Nom d'utilisateur : <em><?php echo $this->Session->read('User.firstname').' '.$this->Session->read('User.lastname'); ?></em><br />
	                        E-mail : <a href="mailto:<?php echo $this->Session->read('User.email'); ?>"><em><?php echo $this->Session->read('User.email'); ?></em></a>
	                    </p>
	                    <hr />
	                    <p>
	                    	<small>
		                        <?php if($this->Session->read('User.lastlogin') != NULL && strlen($this->Session->read('User.email')) > 0): ?>
		                            Dernière connexion le <?php echo $this->Session->read('User.lastlogin'); ?><br />
		                            Dernière IP de connexion : <?php echo $this->Session->read('User.lastip'); ?>
		                        <?php else: ?>
		                            Première connexion ! 
		                        <?php endif; ?>
		                    </small>
	                    </p>
	                </div>
	            </div>
	        </div>
	        <div class="col-xs-12 col-md-6">
	            <div class="panel panel-default">
	                <div class="panel-heading">
	                	<h4>Modifier le mot de passe</h4>
	                </div>
	                <div class="panel-body">
	                    <?php echo $this->Form->create(); ?>
							<fieldset>
								<div class="form-group">
									<?php 
										echo $this->Form->input('User.oldpass', array(
											'type' 			=> 'password',
											'placeholder' 	=> 'Ancien mot de passe',
											'required'		=> 'required',
											'class' 		=> 'form-control',
											'autofocus'		=> 'autofocus'
										));
									?>
								</div>
								<div class="form-group">
									<?php 
										echo $this->Form->input('User.password', array(
											'type' 			=> 'password',
											'placeholder' 	=> 'Nouveau mot de passe',
											'required'		=> 'required',
											'class' 		=> 'form-control'
										));
									?>
								</div>
								<div class="form-group">
									<?php 
										echo $this->Form->input('User.confirm', array(
											'type' 			=> 'password',
											'placeholder' 	=> 'Confirmer le mot de passe',
											'required'		=> 'required',
											'class' 		=> 'form-control'
										));
									?>
								</div>
								<?php 
									echo $this->Form->submit(array(
										'value' => 'Modifier',
										'class' => 'btn btn-primary'
									));
								?>
							</fieldset>
						<?php echo $this->Form->end(); ?>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
</section>