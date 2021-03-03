$(document).ready(function(){
    $(".sidenav").sidenav();
    $('.slider').slider();
    $("select").formSelect();
    $('.carousel').carousel({
        dist: 0,
        shift: 20});
        
   validateMaterializeSelect();
    function validateMaterializeSelect() {
        let classValid = { "border-bottom": "1px solid #4caf50", "box-shadow": "0 1px 0 0 #4caf50" };
        let classInvalid = { "border-bottom": "1px solid #f44336", "box-shadow": "0 1px 0 0 #f44336" };
        if ($("select.validate").prop("required")) {
            $("select.validate").css({ "display": "block", "height": "0", "padding": "0", "width": "0", "position": "absolute" });
        }
        $(".select-wrapper input.select-dropdown").on("focusin", function () {
            $(this).parent(".select-wrapper").on("change", function () {
                if ($(this).children("ul").children("li.selected:not(.disabled)").on("click", function () { })) {
                    $(this).children("input").css(classValid);
                }
            });
        }).on("click", function () {
            if ($(this).parent(".select-wrapper").children("ul").children("li.selected:not(.disabled)").css("background-color") === "rgba(0, 0, 0, 0.03)") {
                $(this).parent(".select-wrapper").children("input").css(classValid);
            } else {
                $(".select-wrapper input.select-dropdown").on("focusout", function () {
                    if ($(this).parent(".select-wrapper").children("select").prop("required")) {
                        if ($(this).css("border-bottom") != "1px solid rgb(76, 175, 80)") {
                            $(this).parent(".select-wrapper").children("input").css(classInvalid);
                        }
                    }
                });
            }
        });
    }
    
          //ingredients group add limit
       /*
          var fieldGroupCopy =`<div class="input-field col s6 l2">
                                <input name="quantity" type="text" placeholder="ex: 3" maxlength="5"
                                    class="validate" >
                            </div>
                            <div class="input-field col s6 l3 ">
                                    <select  name="unit" class="browser-default validate unit" >
                                        <option value="" disabled selected >Units</option>
                                        {% for unit in units %}
                                            <option class="press"  value="{{unit.unit}}">{{unit.unit}}</option>
                                            {% endfor %}
                                    </select>
                                    <br>
                            </div>
                            <div class="input-field col s9 l5">
                                <i class="fas fa-carrot prefix grey-text text-darken-2"></i>
                                <input id="ingredient2" name="ingredients" type="text" placeholder="Ingredient"
                                    class="validate" required>
                            </div>
                            <br>
                            <div class="btn red remove col s2"><i class="fas fa-minus"></i></div>`;
        */
        var i = 0;
        var maxGroup = 25;
        $(".addIngredient").click(function(){
            if($('body').find('.fieldGroup1').length < maxGroup){
                var fieldHTML = '<div class="row fieldGroup1">'+$('.fieldGroupCopy').html()+'</div>';
                $('body').find('.fieldGroup1:last').after(fieldHTML);
                i++;
            }
            });

    

        //preparation group add limit
    var maxSteps = 25;
    var stepCount = 2;
    
    //add steps to the list
    $("#addStep").click(function(){
        if (stepCount <= maxSteps){
            $("#stepList").append(`<div class="row fieldGroup">
            <div class="input-field col s9">
                    <i class="fas fa-book-reader prefix grey-text text-darken-2"></i>
                    <textarea id="step${stepCount}" name="steps" minlength="15" maxlength="300" placeholder="preparation step" class="validate materialize-textarea" required></textarea>
                </div>
            <div class="btn red remove col s2 strong">X</div>
            </div>`);
            stepCount++;
        }
    });

      //notes group add limit
    var maxNotes = 10;
    var noteCount = 2;
    
    //add steps to the list
    $("#addNote").click(function(){
        if (noteCount <= maxNotes){
            $("#noteList").append(`<div class="row fieldGroup">
            <div class="input-field col s9">
                    <i class="fas fa-comment-dots prefix grey-text text-darken-2"></i>
                    <textarea id="note${noteCount}" name="notes" minlength="15" maxlength="300" placeholder="note" class="validate materialize-textarea" required></textarea>
                </div>
            <div class="btn red remove col s2 strong">X</div>
            </div>`);
            noteCount++;
        }
    });

    //remove fields group
    $("body").on("click",".remove",function(){ 
        $(this).parents(".fieldGroup").remove();
        noteCount--;
    });
    // remove group
        $("body").on("click",".remove",function(){ 
        $(this).parents(".fieldGroup1").remove();
        ingredientCount--;
        });
    

  });