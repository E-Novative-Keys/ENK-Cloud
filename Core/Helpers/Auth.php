<?php

class Auth
{
	private $controller = null;
	public $deny 		= false;

	public function __construct($controller)
	{
		$this->controller = $controller;
	}

	/**
	* Récupération des informations de Session de l'utilisateur
	* Utilisation :
	* $this->Auth->user();
	* $this->Auth->user('role');
	*/
	public function user($attribute = null)
	{
		if(!$attribute)
			return $this->controller->Session->read('User');
		else
			return $this->controller->Session->read('User.'.$attribute);
	}

	/**
	* Autorisation d'accès aux actions sélectionnées ou à toutes les actions d'un controller donné si l'utilisateur n'est pas connecté
	* $this->Auth->allow(); <- autorise toutes les actions du controller
	* $this->Auth->allow('action1');
	* $this->Auth->allow(array('action1', 'action2'));
	*/
	public function allow($actions = array())
	{
		if(AUTH_ENABLE)
		{
			if(!is_array($actions))
			{
				$tmp 		= $actions;
				$actions 	= array();
				array_push($actions, $tmp);
			}

			if(empty($actions))
				$this->deny = false;
			else
			{
				if(in_array($this->controller->request->action, $actions))
					$this->deny = false;
			}
		}
	}

	/**
	* Interdiction d'accès aux actions sélectionnées ou à toutes les actions d'un controller donné si l'utilisateur n'est pas connecté
	* Utilisation :
	* $this->Auth->deny(); <- interdit toutes les actions du controller
	* $this->Auth->deny('action1');
	* $this->Auth->deny(array('action1', 'action2'));
	*/
	public function deny($actions = array())
	{
		if(AUTH_ENABLE)
		{
			if(!is_array($actions))
			{
				$tmp 		= $actions;
				$actions 	= array();
				array_push($actions, $tmp);
			}

			if(empty($actions))
			{
				if(!$this->isLogged())
					$this->deny = true;
			}
			else
			{
				if(in_array($this->controller->request->action, $actions) && !$this->isLogged())
					$this->deny = true;
			}
		}
	}

	/**
	* Vérification de l'état de connexion
	*/
	public function isLogged()
	{
		return $this->controller->Session->read('User.role');
	}

	/**
	* Vérification de l'autorisation d'accès à un controller par le rôle de l'utilisateur connecté
	* Utilisation :
	* $this->Auth->authorized('admin');
	* $this->Auth->authorized(array('admin', 'member'))
	*/
	public function authorized($roles = array())
	{
		if(AUTH_ENABLE && $this->isLogged())
		{
			for($i = 0; $i < count($roles); $i++)
			{
				if($this->user('role') == $roles[$i])
					$this->deny = false;
			}
		}
	}

	/**
	* Vérification des informations de connexion saisies en POST
	* Champs analysés : loginField (par défaut email) et password, l'utilisateur, s'il existe en BDD doit être validé
	* Mise en Session d'informations si les informations de connexion sont valides
	*/
	public function login($loginField = 'email')
	{
		if(isset($this->controller->request->data['User']['password']))
			$this->controller->request->data['User']['password'] = $this->password($this->controller->request->data['User']['password']);

		$user = $this->controller->curl('http://enkwebservice.com/connect', $this->controller->request->data);
		$user = json_decode($user, true);

		if(isset($user['user']))
		{
			$user = $user['user'];

			if(isset($user['token']) && $user['role'] == 'client')
			{
				$this->controller->Session->write('Token.link', base64_encode($user['email']));
				$this->controller->Session->write('Token.fields', $user['token']);
				$this->controller->Session->write('User.role', 'client');
				$this->controller->Session->write('User.id', $user['id']);
				$this->controller->Session->write('User.firstname', $user['firstname']);
				$this->controller->Session->write('User.lastname', $user['lastname']);
				$this->controller->Session->write('User.email', $user['email']);
				$this->controller->Session->write('User.address', $user['address']);
				$this->controller->Session->write('User.siret', $user['siret']);
				$this->controller->Session->write('User.phonenumber', $user['phonenumber']);
				$this->controller->Session->write('User.enterprise', $user['enterprise']);

				if($user['lastlogin'] != null && strlen($user['lastlogin']) > 0)
					$this->controller->Session->write('User.lastlogin', DateTime::createFromFormat('Y-m-d H:i:s', $user['lastlogin'])->format('d-m-Y H:i:s'));
				else
					$this->controller->Session->write('User.lastip', null);
				$this->controller->Session->write('User.lastip', $user['lastip']);

				return true;
			}
			else
				return false;
		}
		else
			return false;
	}

	/**
	* Déconnexion de l'utilisateur
	*/
	public function logout()
	{
		if($this->isLogged())
		{
			$this->controller->request->data['Token'] = $this->controller->Session->read('Token');

			$this->controller->curl('http://enkwebservice.com/disconnect', $this->controller->request->data);
			unset($_SESSION['User']);
			unset($_SESSION['Token']);
		}
	}

	/**
	* Génération d'un password
	*/
	public function password($value)
	{
		return base64_encode(md5($value));
	}
}

?>