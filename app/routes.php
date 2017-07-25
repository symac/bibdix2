<?php
// Home page
$app->get('/', "Bibdix\Controller\HomeController::indexAction");

$app->get('/manifest/{code}/{navigateur}', "Bibdix\Controller\HomeController::manifestAction")->bind("manifest");

$app->get('/download/{code}/{navigateur}/{versionId}', "Bibdix\Controller\HomeController::buildAction")->bind("download");

$app->get('/view-instance/{code}', "Bibdix\Controller\HomeController::viewCodeAction")->bind("view-instance");
