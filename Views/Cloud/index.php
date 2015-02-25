<?php $title_for_layout = 'Cloud | ENK-Cloud'; ?>
<?php echo $this->Html->script('cloud'); ?>

<section>
    <div class="row">
        <div id="files">
            <table id="client-files" class="table-reponsive col-xs-12">
                <thead class="table-header">
                    <tr class="">
                        <th class="col-xs-5 col-sm-6 col-md-6 col-lg-6">
                        	<img src="images/etoile.svg" height="26px" style="margin-left:-10px" />
                        	Nom
                        </th>    
                        <th class="col-xs-2 col-sm-2 white-border">Taille</th>    
                        <th class="col-xs-3 col-sm-2 white-border">Type</th>    
                        <th class="col-xs-2 col-sm-2 white-border">
                        	<span class="show-on-phones">Créé</span>
                        	<span class="hide-on-phones">Créé le</span>
                        </th>    
                    </tr>
                </thead>
                <tbody></tbody>
            </table>

            <table id="dev-files" class="table-reponsive col-xs-12">
                <thead class="table-header">
                    <tr class="">
                        <th class="col-xs-5 col-sm-6 col-md-6 col-lg-6">
                        	<img src="images/etoile.svg" height="26px" style="margin-left:-10px" />
                        	Nom
                        </th>    
                        <th class="col-xs-2 col-sm-2 white-border">Taille</th>    
                        <th class="col-xs-3 col-sm-2 white-border">Type</th>    
                        <th class="col-xs-2 col-sm-2 white-border">
                        	<span class="show-on-phones">Créé</span>
                        	<span class="hide-on-phones">Créé le</span>
                        </th>    
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>  
    </div>
</section>

<?php echo $this->Html->link('Logout', array('controller' => 'users', 'action' => 'logout')); ?>