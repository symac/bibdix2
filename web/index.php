<?php

require_once __DIR__ . '/../vendor/autoload.php';

$app = new Silex\Application();

// enable the debug mode
$app['debug'] = true;

require __DIR__.'/../app/config/dev.php';
require __DIR__.'/../app/routes.php';
require __DIR__.'/../app/app.php';

$app->run();