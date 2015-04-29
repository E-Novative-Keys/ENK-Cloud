<nav class="jumbotron">
    <div class="row">
        <?php
            echo $this->link(
                $this->image('cloud.svg', array('alt' => 'Cloud')),
                array('controller' => 'cloud', 'action' => 'index'),
                array('class' => 'col-xs-4 col-sm-1 center', 'id'=> 'link-cloud')
            );
        ?>
        <?php
            echo $this->link(
                $this->image('notification.svg', array('alt' => 'Notifications')),
                array('controller' => 'notifications', 'action' => 'index'),
                array('class' => 'col-xs-4 col-sm-1 center', 'id' => 'link-notifications')
            );
        ?>
        <?php
            echo $this->link(
                $this->image('messagerie.svg', array('alt' => 'Messagerie')),
                array('controller' => 'mails','action' => 'index'),
                array('class' => 'col-xs-4 col-sm-1 center', 'id' => 'link-messages')
            );
        ?>

        <div id="nav-buttons" class="col-sm-9 col-md-9 col-lg-9 hide-on-phones">
            <?php if($this->controller->request->controller == "cloud" && $this->controller->request->action == "index"): ?>
                <button class="btn enk-button storage-button" id="storage">
                    <?php
                        echo $this->image('cloud_bleu.svg', array(
                            'alt'       => 'Espace de stockage',
                            'height'    => '20'
                        ));
                    ?>
                    <span class="show-on-desktops inline">Espace de stockage</span>
                </button>
                <button class="btn enk-button files-buttons" id="new-dir" data-toggle="modal" data-target="#newDirModal">
                    <?php
                        echo $this->image('nouveau_dossier.svg', array(
                            'alt'       => 'Nouveau dossier',
                            'height'    => '20'
                        ));
                    ?>
                    <span class="show-on-desktops inline">Nouveau dossier</span>
                </button>
                <?php 
                    echo $this->controller->Form->input('Cloud.file', array(
                        'type'  =>  'file',
                        'id'    =>  'file-upload',
                        'style' =>  'display:none;'
                    ));
                ?>
                <button class="btn enk-button files-buttons" id="btn-upload">
                    <?php
                        echo $this->image('upld_fichier.svg', array(
                            'alt'       => 'Nouveau fichier',
                            'height'    => '20'
                        ));
                    ?>
                    <span class="show-on-desktops inline">Uploader un fichier</span>
                </button>
            <?php endif; ?>

            <?php if(($this->controller->request->controller == "mails" && $this->controller->request->action == "add")
            || $this->controller->request->controller == "cloud"): ?>
                <span class="btn enk-button files-buttons dropdown projects-button" data-project="">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        <?php
                            echo $this->image('menu.svg', array(
                                'alt'       => 'Projet',
                                'height'    => '20'
                            ));
                        ?>
                        <span class="show-on-desktops inline">Sélectionner un projet</span>
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" role="menu"></ul>
                </span>
            <?php endif; ?>
        </div>
    </div>

    <div class="modal fade" id="newDirModal" tabindex="-1" role="dialog" aria-labelledby="newDir" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fermer"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="newDir">Nouveau dossier</h4>
                </div>
            
                <form class="form-horizontal">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="dir" class="col-sm-3 control-label">Nom du dossier</label>
                            <div class="col-sm-8">
                                <input type="text" id="dir" placeholder="Dossier" class="form-control" required />
                            </div>
                        </div>
                    </div>
                        
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Annuler</button>
                        <button type="submit" id="newDirSubmit" class="btn btn-primary" data-dismiss="modal">Créer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</nav>