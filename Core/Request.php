<?php
/**
* Stocke l'url souhaitée par l'utilisateur ainsi que les données envoyées en POST si elles existent
*/
class Request
{
	public $url		= null;
	public $data	= false;

	public function __construct()
	{
		$this->url = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '/';

		if(!empty($_POST))
		{
			if($this->isJSON($_POST))
				$data = json_decode($_POST, true);
			else
				$data = $_POST;

			$this->data = new stdClass();

			foreach($data as $value)
				$this->data = $value;
		}
	}

	protected function isJSON($string)
	{
		return is_string($string) && is_array(json_decode($string, true)) ? true : false;
	}
}

?>