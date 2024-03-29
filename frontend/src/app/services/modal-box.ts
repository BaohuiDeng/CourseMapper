
import { Component } from "@angular/core";

@Component({
    selector:'app-modal-box',
    template:`
<div class="row">
    <div class="modal" id="{{mid}}" tabindex="-1" role="dialog"
         aria-labelledby="{{title}}" aria-hidden="true">

        <section class="content">
            <div class="row row-centered">
                <div class="col-xs-12 col-md-5 col-centered">
                    <div class="box no-border">
                        <div class="box-header with-border">
                            <h3 class="box-title">{{title}}</h3>

                            <div class="box-tools pull-right">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                        aria-hidden="true">&times;</span></button>
                            </div>
                        </div>

                        <div class="box-body no-border">
                            <ng-transclude></ng-transclude>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</div>

    `,
    


})


export class modalBox{
 
}
