<?php $title_for_layout = 'Envoyés | ENK-Cloud'; ?>

<?php echo $this->Html->css('contextMenu'); ?>
<?php echo $this->Html->css('mails'); ?>

<?php echo $this->Html->script('jquery-ui.min'); ?>
<?php echo $this->Html->script('contextMenu'); ?>
<?php echo $this->Html->script('mailsManager'); ?>
<?php echo $this->Html->script('mails'); ?>

<section>
    <div class="row">
        <div id="email" data-type="sent">
            <div class="email-table">
                <div class="table-responsive">
                    <table id="mails" class="col-xs-12">
                        <thead class="table-header">
                            <tr>
                                <th class="col-md-3 col-xs-2 col-sm-2 white-border">Pour</th>    
                                <th class="col-md-6 col-xs-3 col-sm-2 white-border">Sujet</th>    
                                <th class="col-md-3 col-xs-2 col-sm-2 white-border">Date</th> 
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>

            <div class="email-table">
                <div class="table-responsive">
                    <table class="col-xs-12">
                        <thead class="table-header">
                            <tr><th class="col-md-12 col-xs-12 col-sm-12 white-border center">Détails du message envoyé</th></tr>
                        </thead>
                    </table>
                    <div class="col-xs-12" id="details"></div>
                </div>
            </div>
        </div>  
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="delete" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fermer"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Suppression d'email</h4>
                </div>
                <div class="modal-body">
                    <p>Etes-vous sur de vouloir supprimer cet e-mail?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Annuler</button>
                    <button type="submit" id="deleteSubmit" class="btn btn-primary" autofocus data-dismiss="modal">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</section>