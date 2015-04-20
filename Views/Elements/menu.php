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

                    echo $this->link($storage,
                        array('controller' => 'cloud', 'action' => 'index'),
                        array('class' =>
                            ($this->controller->request->controller == 'cloud' && $this->controller->request->action == 'index')
                            ? 'left-menu-stockage left-menu-selected' : 'left-menu-stockage'
                        )
                    );
                ?>
            </div>
            <div>
                <?php 
                    echo $this->link(
                        $this->image('notification_bleu.svg', array(
                            'alt'       => 'Notifications',
                            'height'    => '30'
                        ))."Notifications",
                        array('controller' => 'notifications', 'action' => 'index'),
                        array('class' =>
                            ($this->controller->request->controller == 'notifications' && $this->controller->request->action == 'index')
                            ? 'left-menu-notifications left-menu-selected' : 'left-menu-notifications'
                        )
                    );
                ?>
            </div>
            <div>
                <?php 
                    echo $this->link(
                        $this->image('messagerie_bleu.svg', array(
                            'alt'       => 'Messagerie',
                            'height'    => '30'
                        ))."Messagerie",
                        array('controller' => 'mails', 'action' => 'index'),
                        array('class' =>
                            ($this->controller->request->controller == 'mails')
                            ? 'left-menu-messagerie left-menu-selected' : 'left-menu-messagerie'
                        )
                    );
                ?>
            </div>

             <?php if($this->controller->request->controller == "mails"): ?>
                <div>
                    <?php 
                        echo $this->link("Message reçus",
                            array('controller' => 'mails', 'action' => 'index'),
                            array('class' =>
                                ($this->controller->request->controller == 'mails' && $this->controller->request->action == 'index')
                                ? 'left-submenu-messagerie left-submenu-selected' : 'left-submenu-messagerie'
                            )
                        );
                    ?>
                </div>
                <div>
                    <?php 
                        echo $this->link("Messages envoyés",
                            array('controller' => 'mails', 'action' => 'sent'),
                            array('class' =>
                                ($this->controller->request->controller == 'mails' && $this->controller->request->action == 'sent')
                                ? 'left-submenu-messagerie left-submenu-selected' : 'left-submenu-messagerie'
                            )
                        );
                    ?>
                </div>
                <div>
                    <?php 
                        echo $this->link("Composer un message",
                            array('controller' => 'mails', 'action' => 'add'),
                            array('class' =>
                                ($this->controller->request->controller == 'mails' && $this->controller->request->action == 'add')
                                ? 'left-submenu-messagerie left-submenu-selected' : 'left-submenu-messagerie'
                            )
                        );
                    ?>
                </div>

            <?php elseif($this->controller->request->controller == "cloud" && $this->controller->request->action == "index"): ?>
                <div>
                    <textarea id="comment" class="form-control"></textarea>
                    <button id="edit-comment" class="btn enk-button">Enregistrer</button>
                </div>
                <div id="DnDStatus"></div>

            <?php endif; ?>
        </div>
    </div>
</section>