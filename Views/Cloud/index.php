<?php $title_for_layout = 'Cloud | ENK-Cloud'; ?>

<?php echo $this->Html->css('contextMenu'); ?>
<?php echo $this->Html->css('fileDNDUpload'); ?>

<?php echo $this->Html->script('jquery.filesize.min'); ?>
<?php echo $this->Html->script('contextMenu'); ?>
<?php echo $this->Html->script('cloud'); ?>
<?php echo $this->Html->script('fileDnDUpload'); ?>

<section>
    <div class="row">
        <div id="files">
            <div class="files-table">
                <div class="table-responsive">
                    <table id="client-files" class="col-xs-12">
                        <thead class="table-header">
                            <tr class="">
                                <th class="col-xs-5 col-sm-6 col-md-6 col-lg-6">
                                    <span class="center">
                                        <span id="previous_client" class="glyphicon glyphicon-menu-left previous_files"></span>
                                        Nom
                                    </span>
                                </th>    
                                <th class="col-xs-2 col-sm-2 white-border">Taille</th>    
                                <th class="col-xs-3 col-sm-2 white-border">Type</th>    
                                <th class="col-xs-2 col-sm-2 white-border">
                                	<span class="show-on-phones">Modifié</span>
                                	<span class="hide-on-phones">Modifié le</span>
                                </th>    
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>

            <div class="files-table">
                <div class="table-responsive">
                    <table id="dev-files" class="table-reponsive col-xs-12">
                        <thead class="table-header">
                            <tr class="">
                                <th class="col-xs-5 col-sm-6 col-md-6 col-lg-6">
                                	<span class="center">
                                        <span id="previous_dev" class="glyphicon glyphicon-menu-left previous_files"></span>
                                        Nom
                                    </span>
                                </th>    
                                <th class="col-xs-2 col-sm-2 white-border">Taille</th>    
                                <th class="col-xs-3 col-sm-2 white-border">Type</th>    
                                <th class="col-xs-2 col-sm-2 white-border">
                                	<span class="show-on-phones">Modifié</span>
                                	<span class="hide-on-phones">Modifié le</span>
                                </th>    
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>  
    </div>
</section>