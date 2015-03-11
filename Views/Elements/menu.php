<section>
    <div class="row">
        <div id="left-menu" class="col-xs-12 col-sm-3 col-md-3 col-lg-3 hide-on-phones"><!-- element --> 
            <div>
                <?php
                    $storage = "<span class=\"hide-on-tablets\">".
                                $this->image('cloud.svg', array(
                                    'alt'       => 'Espace de Stockage',
                                    'height'    => '22',
                                    'style'     => 'padding-right:10px;'
                                )).
                                " Espace de Stockage</span> <span class=\"show-on-tablets\">".
                                $this->image('cloud.svg', array(
                                    'alt'       => 'Espace de Stockage',
                                    'height'    => '22',
                                    'style'     => 'padding-right:10px;'
                                )).
                                " Stockage</span>";

                    echo $this->link($storage , array('controller' => 'cloud', 'action' => 'index'), array('class' => 'left-menu-stockage'));
                ?>
            </div>
            <div>
                <button type="goToNotifications" class="left-menu-notifications">
                    <?php 
                        echo $this->image('notification_bleu.svg', array(
                            'alt'       => 'Notifications',
                            /*'url'       => array('controller' => 'cloud', 'action' => 'index'),*/
                            'height'    => '30'
                        ));
                    ?>
                    Notifications
                </button>
            </div>
            <div>
                <button type="goToMessagerie" class="left-menu-messagerie">
                    <?php 
                        echo $this->image('messagerie_bleu.svg', array(
                            'alt'       => 'Messagerie',
                            /*'url'       => array('controller' => 'cloud', 'action' => 'index'),*/
                            'height'    => '30'
                        ));
                    ?>
                    Messagerie
                </button>
            </div>

            <?php if($this->controller->request->controller == "cloud" && $this->controller->request->action == "index"): ?>
                <div>
                    <textarea id="comment" class="form-control"></textarea>
                    <button id="edit-comment" class="btn enk-button">Enregistrer</button>
                </div>
                <div id="DnDStatus"></div>
            <?php endif; ?>
        </div>
    </div>
</section>