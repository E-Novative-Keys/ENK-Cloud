<header class="jumbotron">
    <div class="row">
        <div id="enk-logo-container" class="col-xs-6 col-sm-3 col-md-3 col-lg-3 left">
            <?php 
                echo $this->image('logo.svg', array(
                    'alt'   => 'Logo E-Novative Keys',
                    'url'   => array('controller' => 'cloud', 'action' => 'index'),
                    'id'    => 'enk-logo'
                ));
            ?>
        </div>

        <div class="header-menu col-xs-6 col-sm-9 col-md-9 col-lg-9 right hide-on-phones">
            <span class="btn enk-button menu-button dropdown<?php echo ($this->controller->request->controller != 'cloud') ? ' adjusted' : ''; ?>" data-project="">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                    <?php echo $this->image('menu.svg', array('alt' => 'Menu', 'height' => '20')); ?>
                    Menu
                </a>
                <ul class="dropdown-menu" role="menu">
                    <li>
                        <?php echo $this->link('Mon profil', array('controller' => 'users', 'action' => 'profile')); ?>
                    </li>
                    <li>
                        <?php echo $this->link('Déconnexion', array('controller' => 'users', 'action' => 'logout')); ?>
                    </li>
                </ul>
            </span>
            <?php if($this->controller->request->controller == "cloud") { ?>
                <input type="text" class="search-bar" id="search" placeholder="           Rechercher" />
            <?php } ?>
        </div>

        <div class="header-menu col-xs-6 col-md-9 col-lg-9 right show-on-phones">
            <span class="btn enk-button dropdown projects-button" data-project="">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                    <?php echo $this->image('menu.svg', array('alt' => 'Menu', 'height' => '20')); ?>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu center" role="menu">
                    <li>
                        <?php echo $this->link('Déconnexion', array('controller' => 'users', 'action' => 'logout')); ?>
                    </li>
                     <li role="presentation" class="divider"></li>
                </ul>
            </span>  
        </div>
    </div>
</header>