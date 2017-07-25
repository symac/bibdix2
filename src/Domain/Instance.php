<?php
namespace Bibdix\Domain;

use Bibidx\Domain\Utils;
use function Cs278\Mktemp\temporaryDir;

class Instance {
    /**
     * Instance id.
     *
     * @var integer
     */
    private $id;

    /**
     * Instance Nom.
     *
     * @var string
     */
    private $nom;

    /**
     * Instance code.
     *
     * @var string
     */
    private $code;

    /**
     * Instance etab.
     *
     * @var string
     */
    private $etab;

    /**
     * Instance description.
     *
     * @var string
     */
    private $description;

    /**
     * Instance url_0 (when available)
     *
     * @var string
     */
    private $url_0;

    /**
     * Instance url_1 (when others cases)
     *
     * @var string
     */
    private $url_1;

    /**
     * Instance rcr (separated by ,)
     *
     * @var string
     */
    private $rcr;


    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    public function getNom() {
        return $this->nom;
    }

    public function setNom($nom) {
        $this->nom = $nom;
        return $this;
    }

	public function getCode() {
        return $this->code;
    }

    public function setCode($code) {
        $this->code = $code;
        return $this;
    }

	public function getEtab() {
        return $this->etab;
    }

    public function setEtab($etab) {
        $this->etab = $etab;
        return $this;
    }

	public function getDescription() {
		return $this->description;
	}

	public function setDescription($description) {
		$this->description = $description;
		return $this;
	}

	public function getUrl0() {
		return $this->url_0;
	}

	public function setUrl0($url_0) {
		$this->url_0 = $url_0;
		return $this;
	}

	public function getUrl1() {
		return $this->url_1;
	}

	public function setUrl1($url_1) {
		$this->url_1 = $url_1;
		return $this;
	}

    public function getRcr() {
        return $this->rcr;
    }

    public function setRcr($rcr) {
        $this->rcr = $rcr;
        return $this;
    }

	public function getChromeAppId() {
		return $this->chrome_app_id;
	}

	public function setChromeAppId($chrome_app_id) {
		$this->chrome_app_id = $chrome_app_id;
		return $this;
	}

	public function getSecretKey() {
		return $this->secret_key;
	}

	public function setSecretKey($secret_key) {
		$this->secret_key = $secret_key;
		return $this;
	}


	public function getFirefoxAppId() {
		return $this->firefox_app_id;
	}

	public function setFirefoxAppId($firefox_app_id) {
		$this->firefox_app_id = $firefox_app_id;
		return $this;
	}

    public function dump() {
    	print "<pre>";
    	print $this->code."\n";
    	print $this->Nom."\n";

    	print "</pre>";
    }

}