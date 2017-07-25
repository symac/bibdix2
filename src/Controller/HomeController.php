<?php

namespace Bibdix\Controller;

use Silex\Application;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class HomeController {
    /**
     * Home page controller.
     *
     * @param Application $app Silex application
     */
    public function indexAction(Application $app) {
        $instances = $app['dao.instance']->findAll();
        return $app['twig']->render('index.html.twig', array("instances" => $instances));
    }

    public function manifestAction(Request $request, Application $app, String $code, String $navigateur) {
        $version = $app["dao.instance"]->findByCode($code);
        return $version->buildManifest($navigateur);
    }

    public function buildAction(Request $request, Application $app, String $code, String $navigateur, String $versionId) {
        $version = $app["dao.version"]->find($versionId);
        $version->setInstance($app["dao.instance"]->findByCode($code));
        if ($version->build($navigateur)) {
            $path = realpath($version->getFilename());
            return $app->sendFile($path)->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT,basename($path));
        } else {
            return \Response("Erreur génération fichier");
        }
    }

    public function downloadAction(Request $request, Application $app, String $code, String $navigateur, String $filename) {
        $path = realpath(__DIR__."/../../web/versions/$code/builds/$filename");
        
    }

    public function viewCodeAction(Request $request, Application $app, String $code) {
        $instance = $app["dao.instance"]->findByCode($code);
        $versions = $app["dao.version"]->findAll();
        return $app['twig']->render('index-code.html.twig', array("instance" => $instance, "versions" => $versions));
    }
}