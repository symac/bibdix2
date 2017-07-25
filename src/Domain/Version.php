<?php

namespace Bibdix\Domain;

use Bibidx\Domain\Utils;
use function Cs278\Mktemp\temporaryDir;

class Version {
	/**
     * Instance 
     *
     * @var \Bibdix\Domain\Instance
     */
    private $instance;

    private $id;
    private $path;
    private $version;
    private $versionName;
    private $releaseDate;
    private $chrome;
    private $firefox;
    private $releaseNotes;
    private $filename;

    public function setFilename($filename) {
        $this->filename = $filename;
        return $this;
    }

    public function getFilename() {
        return $this->filename;
    }

    public function setInstance(\Bibdix\Domain\Instance $instance) {
    	$this->instance = $instance;
    }

    public function getInstance() {
    	return $this->instance;
    }

    public function setPath(String $path) {
        $this->path = $path;
    }

    public function getPath() {
        return $this->path;
    }

    public function setReleaseNotes(String $releaseNotes) {
        $this->releaseNotes = $releaseNotes;
    }

    public function getReleaseNotes() {
        return $this->releaseNotes;
    }

    public function setId(Int $id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function setVersion(String $version) {
    	$this->version = $version;
    }

    public function getVersion() {
    	return $this->version;
    }

    public function setVersionName(String $versionName) {
    	$this->versionName = $versionName;
    }

    public function getVersionName() {
    	return $this->versionName;
    }

    public function setReleaseDate(String $releaseDate) {
    	$this->releaseDate = $releaseDate;
    }

    public function getReleaseDate() {
    	return $this->releaseDate;
    }

    public function setChrome($chrome) {
    	$this->chrome = $chrome;
    }

    public function getChrome() {
    	return $this->chrome;
    }

    public function setFirefox($firefox) {
    	$this->firefox = $firefox;
    }

    public function getFirefox() {
    	return $this->firefox;
    }

    public function buildManifest($navigateur) {
        $manifest = [];
        $manifest["description"] = $this->instance->getDescription();
        $manifest["manifest_version"] = 2;
        $manifest["name"] = $this->instance->getNom();

        $tempInstance = $this->getVersion($navigateur);
        $tempInstanceName = "";
        if (preg_match("#-b#", $tempInstance)) {
            $tempInstanceName = $tempInstance;
            $tempInstance = preg_replace("#-b(\d*)$#", ".$1", $tempInstance);
        }

        $manifest["version"] = $tempInstance;
        if ($tempInstanceName != "") {
            $manifest["version_name"] = $tempInstanceName;
        }

        $manifest["homepage_url"] = "http://www.geobib.fr/bibdix";
        $manifest["icons"] = [];
        $manifest["icons"]["48"] = "data/img/logo.png";

        # Permissions
        $manifest["permissions"] = [];
        $manifest["permissions"][] = "https://www.sudoc.fr/*";
        $manifest["permissions"][] = "http://scd.u-bordeaux-montaigne.fr/*";
        $manifest["permissions"][] = "*://www.geobib.fr/*";
        $manifest["permissions"][] = "alarms";
        $manifest["permissions"][] = "storage";

        # Background 
        $manifest["background"] = [];
        $manifest["background"]["scripts"] = [];
        $manifest["background"]["scripts"][] = "checkUpdates.js";
        $manifest["background"]["persistent"] = false;

        $manifest["content_scripts"] = [];

        $manifest["content_scripts"][] = [
            "matches" => [
                "*://*.sudoc.abes.fr/*",
                "*://appeldulivre.fr/*",
                "*://appeldulivre.com/*",
                "*://www.decitre.fr/*",
                "*://www.mollat.com/*",
                "*://www.electre.com/*"
            ], 
            "js" => [
                "lib/config.js",
                "lib/utils.js",
                "lib/jquery-3.2.1.min.js",
                "modules/AppelDuLivre.js",
                "modules/Decitre.js",
                "modules/Electre.js",
                "modules/Mollat.js",
                "dispatcher.js"
            ]
        ];

        $manifest["content_scripts"][] = [
            "matches" => [
                "*://*/*"
            ], 
            "js" => [
                "lib/jquery-3.2.1.min.js",
                "ezproxy.js"
            ]
        ];

        $manifest["web_accessible_resources"] = [
            "data/searching.gif",
            "data/img/absent.png",
            "data/img/present.png",
            "data/img/inconnu.png"
        ];

        return json_encode($manifest, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
    }

    public function build(String $navigateur) {
        # On commence par copier les fichiers de base
        $tempdir  = temporaryDir(null, __DIR__.'/../../tmp');
        $sourceDir = __DIR__."/../../webextension/".$this->getPath()."/";

        if (!((is_dir($sourceDir) && is_dir($tempdir)))) {
            print "Problème de dossier [".realpath($sourceDir)." / $tempdir]";
            return false;
        }
        \Bibdix\Domain\Utils::myCopy($sourceDir, $tempdir);

        # On va ajouter le manifest
        $manifest = $this->buildManifest($navigateur);
        file_put_contents($tempdir."/manifest.json", $manifest);

        # On va copier tous les assets
        $dirAssets = __DIR__."/../../web/instances/".$this->instance->getCode()."/assets";

        if (is_dir($dirAssets)) {
            \Bibdix\Domain\Utils::myCopy(__DIR__."/../../web/instances/".$this->instance->getCode()."/assets/", $tempdir."/data/img/");
        } else {
            print "Problème répertoire assets";
            return false;
        }
        
        # On va faire un zip de tout cela
        $zip = new \ZipArchive();

        $filename = "bibdix-firefox-".$this->instance->getCode()."-".$this->getVersion($navigateur).".zip";

        $filenameWithPath = __DIR__."/../../web/instances/".$this->instance->getCode()."/builds/".$filename;

        $ret = $zip->open($filenameWithPath, \ZipArchive::CREATE);

        if ($ret !== TRUE) {
            print "Echec lors de l'ouverture de l'archive $ret";
            return false;
        } else {
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($tempdir),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($files as $name => $file)
            {
                // Skip directories (they would be added automatically)
                if (!$file->isDir())
                {
                    // Get real and relative path for current file
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen(realpath($tempdir)) + 1);
                    // Add current file to archive
                    $zip->addFile($filePath, $relativePath);
                }
            }
            $zip->close();
        }
        $this->setFilename($filenameWithPath);
        return true;
    }
}

?>