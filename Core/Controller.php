<?php
/**
* Classe Controller parente
*/
class Controller
{
	public $request 	= null;
	public $layout		= 'default';
	private $vars		= array();

	public function __construct($request = null)
	{
		// Helpers
		$this->Html 	= new Html($this);
		$this->Form 	= new Form($this);
		$this->Session 	= new Session($this);
		$this->Auth 	= new Auth($this);

		if($request)
			$this->request = $request;

		$this->beforeFilter();

		if(AUTH_ENABLE && $this->Auth->deny)
			return $this->redirect('/');
	}

	/**
	* Fonction exécutée avec le constructeur, Redéfinition dans les classes filles
	* Utilisation :
	* Redéfinir les autorisations d'accès aux actions
	* Redéfinir le layout utilisé, ...
	*/
	public function beforeFilter()
	{
		// Chargement du model par défaut pour éviter de le réinclure à chaque action
		$model = str_replace('sController', '', get_class($this));
		if($this->exist($model, 'model'))
			$this->loadModel($model);

		if(AUTH_ENABLE)
			$this->Auth->deny();
	}

	/**
	* Chargement d'un model
	*/
	public function loadModel($name)
	{
		// Si le model n'est pas déjà chargé
		if(!isset($this->$name))
		{
			$file = MODELS.DS.ucfirst($name).'.php';

			if(!file_exists($file))
				$this->notFound('Model '.$name.' introuvable !');

			require_once($file);
			
			// ex : $this->User = new User();
			$this->$name = new $name();

			if(isset($this->Form))
				$this->$name->Form = $this->Form;
		}
	}
	
	/**
	* Rendu d'une vue
	*/
	public function render($view)
	{
		// Importation des variables injectées dans vars par la méthode set de la classe Controller
		extract($this->vars);

		if(strpos($view, '/') === 0)
			$view = VIEWS.DS.$view.'.php';
		else
			$view = VIEWS.DS.ucfirst($this->request->controller).DS.$view.'.php';

		// Si le layout et la vue existent, on charge le tout
		if($this->layout
		&& file_exists(VIEWS.DS.'Layouts'.DS.$this->layout.'.php')
		&& file_exists($view))
		{
			// Temporisation de sortie
			// Rien n'est envoyé au navigateur et est stocké dans un tampon : $content_for_layout
			ob_start();
			require_once($view);
			$content_for_layout = ob_get_clean();
			
			require_once(VIEWS.DS.'Layouts'.DS.$this->layout.'.php');
		}
		// Si $this->layout = null ou si le layout n'existe pas on ne charge que la vue (utile pour ajax)
		else if(file_exists($view))
			require_once($view);
		// Sinon on encode en JSON
		else
			echo json_encode($this->vars);
	}

	/**
	* Passage de variables à la vue
	*/
	public function set($key, $value = null)
	{
		if(is_array($key))
			$this->vars += $key;
		else
			$this->vars[$key] = $value;
	}

	/**
	* Erreurs 404
	*/
	public function notFound($message)
	{	
		header("HTTP/1.0 404 Not Found");

		$this->set(compact('message'));
		$this->render('/Errors/error404');
		
		die();
	}

	/**
	* Redirections
	*/
	public function redirect($url, $code = null)
	{
		if($code == 301)
			header("HTTP/1.1 301 Moved Permanently");
		else if($code == 302)
			header("HTTP/1.1 302 Moved Temporarily");
		
		if(is_array($url))
			header("Location: ".Router::url($url));
		else
		{
			if(strpos($url, '/') === 0)
				header("Location: ".BASE_URL.$url);
			else
				header("Location: ".((!strstr($url, 'http')) ? 'http://' : '').$url);
		}
	}

	/**
	* Vérification de l'existance d'un fichier
	*/
	public function exist($name, $type)
	{
		$file = null;

		switch($type)
		{
			case 'model' :
				$file .= MODELS.DS.ucfirst($name).'.php';
				break;

			case 'controller' :
				$file .= CONTROLLERS.DS.$name.'.php';
				break;

			case 'img' :
				$file .= IMG_ROOT.$name;
				break;

			case 'css' :
				$file .= CSS_ROOT.$name.'.css';
				break;

			case 'js' :
				$file .= JS_ROOT.$name.'.js';
				break;

			case 'file' :
				$file .= FILES_ROOT.$name;
				break;

			default :
				return false;
		}

		if(!file_exists($file))
			return false;

		return true;
	}

	/**
	* Récupération du contenu d'une page
	* Utilisation :
	* $this->curl('url');
	* $this->curl('url', $postData);
	*/
	public function curl($url = '', $post = array())
	{	 
		if(empty($url))
			return null;

		$data = array();
		$data['data'] = $post;

		$options = array(
			  CURLOPT_URL            => $url,
			  CURLOPT_RETURNTRANSFER => true,       			// Retourner le contenu téléchargé dans une chaine
			  CURLOPT_HEADER         => false,      			// Ne pas inclure l'entête de réponse du serveur dans la chaine retournée
			  CURLOPT_FAILONERROR    => true,       			// Gestion des codes d'erreur HTTP
			  CURLOPT_POST           => true,       			// Requête de type POST
			  CURLOPT_POSTFIELDS     => http_build_query($data) // Variables envoyées par POST
		);
		
		// Initialisation de cURL
		$curl = curl_init();

		if(empty($curl))
			return null;
		 
		// Configuration des options de téléchargement
		curl_setopt_array($curl, $options);
	 	
		// Execution de la requête
		$content = curl_exec($curl);
		
		if(curl_errno($curl))
			return null;
		
		// Fermeture de la connexion
		curl_close($curl);

		return $content;
	}
}

?>