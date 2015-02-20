<div class="top-container">
    <div class="row" style="background-color:#001C53">
        <div class="col-xs-6 col-md-3 col-lg-3 top-logo">
            <?php 
                echo $this->image('logo.png', array(
                    'alt'   => 'Logo E-Novative Keys',
                    'url'   => array('controller' => 'cloud', 'action' => 'index'),
                    'width' => '200'
                ));
            ?>
        </div>
        <div class="col-xs-6 col-md-9 col-lg-9 top-right-menu">
            <button type="menuButton" class="menu-button">
                <?php 
                    echo $this->image('menu.svg', array(
                        'alt'       => 'Menu',
                        'height'    => '20')
                    );
                ?>
                Menu
            </button>
            <a href="">
                <?php 
                    echo $this->image('profil_cloud.svg', array(
                        'alt'       => 'Cloud',
                        'height'    => '20')
                    );
                ?>
            </a> 
            <a href="">
                <?php 
                    echo $this->image('profil.svg', array(
                        'alt'       => 'Profil',
                        'height'    => '20')
                    );
                ?>
            </a>
            <input type="text" class="search-bar" placeholder="Rechercher"/>
        </div>
    </div>
</div>