<?php $title_for_layout = 'Cloud | ENK-Cloud'; ?>

<?php echo $this->Html->css('contextMenu'); ?>
<?php echo $this->Html->css('fileDNDUpload'); ?>

<?php echo $this->Html->script('jquery-ui.min'); ?>
<?php echo $this->Html->script('jquery.filesize.min'); ?>
<?php echo $this->Html->script('contextMenu'); ?>
<?php echo $this->Html->script('filesManager'); ?>
<?php echo $this->Html->script('fileDnDUpload'); ?>
<?php echo $this->Html->script('cloud'); ?>

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
                <div id="client-dropzone"></div>
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

    <div class="modal fade" id="renameModal" tabindex="-1" role="dialog" aria-labelledby="rename" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fermer"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="rename">Renommer un fichier/dossier</h4>
                </div>
            
                <form class="form-horizontal">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="dir" class="col-sm-3 control-label">Nouveau nom</label>
                            <div class="col-sm-8">
                                <input type="text" id="renameField" placeholder="Nouveau nom" class="form-control" required />
                            </div>
                        </div>
                    </div>
                        
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Annuler</button>
                        <button type="button" id="renameSubmit" class="btn btn-primary" data-dismiss="modal">Créer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>