<?php

class User extends Model
{
	public $validate = array(
		'email' => array(
			'EmptyRule' => array(
				'rule' => 'notEmpty',
				'message' => 'Vous devez entrer une adresse e-mail'
			),
			'EmailRule' => array(
				'rule' => 'email',
				'message' => 'Vous devez entrer une adresse e-mail valide'
			)
		),
		'password' => array(
			'EmptyRule' => array(
				'rule' => 'notEmpty',
				'message' => 'Vous devez entrer un mot de passe'
			)
		)
	);
}

?>