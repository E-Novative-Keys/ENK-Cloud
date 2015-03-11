<nav class="jumbotron">
    <div class="row">
        <?php
            echo $this->link(
                $this->image('cloud.svg', array('alt' => 'Cloud')),
                array(
                    'controller' => 'cloud',
                    'action'     => 'index'
                ),
                array(
                    'class'      => 'col-xs-4 col-sm-1 center',
                    'id'         => 'link-cloud'
                ));
        ?>
        <a href="#" class="col-xs-4 col-sm-1 center" id="link-notifications">
            <?php
                echo $this->image('notification.svg', array('alt' => 'Notifications'));
            ?>
        </a>
        <a href="#" class="col-xs-4 col-sm-1 center" id="link-messages">
            <?php
                echo $this->image('messagerie.svg', array('alt' => 'Messagerie'));
            ?>
        </a>

        <div id="nav-buttons" class="col-sm-9 col-md-9 col-lg-9 hide-on-phones"><!-- element -->
            <button class="btn enk-button storage-button" id="storage">
                <?php
                    echo $this->image('cloud_bleu.svg', array(
                        'alt' => 'espace de stockage',
                        'height' => '20'
                    ));
                ?>
                <span class="show-on-desktops inline">Espace de stockage</span>
            </button>
            <button class="btn enk-button files-buttons" id="new-dir">
                <?php
                    echo $this->image('nouveau_dossier.svg', array(
                        'alt' => 'Nouveau dossier',
                        'height' => '20'
                    ));
                ?>
                <span class="show-on-desktops inline">Nouveau dossier</span>
            </button>
            <button class="btn enk-button files-buttons">
                <?php
                    echo $this->image('upld_fichier.svg', array(
                        'alt' => 'Nouveau fichier',
                        'height' => '20'
                    ));
                ?>
                <span class="show-on-desktops inline">Uploader un fichier</span>
            </button>

            <span class="btn enk-button files-buttons dropdown projects-button" data-project="">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                    <?php
                        echo $this->image('menu.svg', array(
                            'alt' => 'Projet',
                            'height' => '20'
                        ));
                    ?>
                    <span class="show-on-desktops inline">Sélectionner un projet</span>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu" role="menu"></ul>
            </span>
        </div>
    </div>
</nav>