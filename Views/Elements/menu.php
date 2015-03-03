<section class="jumbotron">
    <div class="row">
        <div id="left-menu" class="col-xs-12 col-sm-3 col-md-3 col-lg-3 hide-on-phones"><!-- element --> 
            <div>
                <button type="goToStockage" class="left-menu-stockage">
                    <span class="hide-on-tablets">
                        <?php 
                            echo $this->image('cloud.svg', array(
                                'alt'       => 'Espace de Stockage',
                                'url'       => array('controller' => 'cloud', 'action' => 'index'),
                                'height'    => '22',
                                'style'     => 'padding-right:10px;'
                            ));
                        ?>
                        Espace de Stockage
                    </span>
                    <span class="show-on-tablets">
                       <?php 
                            echo $this->image('cloud.svg', array(
                                'alt'       => 'Espace de Stockage',
                                'url'       => array('controller' => 'cloud', 'action' => 'index'),
                                'height'    => '22',
                                'style'     => 'padding-right:10px;'
                            ));
                        ?>
                        Stockage
                    </span>
                </button>
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
            <div id="DnDStatus"></div>
        </div>
    </div>
</section>