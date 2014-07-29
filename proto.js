
//
//
function circlemosaic( cx, cy, min_r, max_r, min_d, max_d, targetitems )
{
    //"Private variables"
    //var obj = obj;
    function inradius( sidelength, numitems )
    {
        var r = 0.5 * sidelength * (1/Math.tan( Math.PI / numitems ));
        return r;
    }
    
    function circumradius( sidelength, numitems )
    {
        var R = 0.5 * sidelength * (1/Math.sin( Math.PI / numitems ));
        return R;
    }
    
    function length_of_side_inradius( inradius, numitems )
    {
        var length = 2 * inradius * Math.tan( Math.PI / numitems );
        return length;
    }
    
    function length_of_side_circumradius( circumradius, numitems )
    {
        var length = 2 * circumradius * Math.sin( Math.PI / numitems );
        return length;
    }
    
    function angle_of_item( d, numitems )
    {
        var angle = Math.tan( Math.PI/numitems );
        return angle;
    }
    //
    //
    function position_item( it )
    {
        var el = $(it.element);
        
        el.css("left", it.x + 'px' );
        el.css("top", it.y + 'px' );
        
        el.css("transformOrigin", 'top left');
        el.css("transform", 'rotate('+(it.rotation-90)+'deg) ' +
                             'translate(-'+(it.width*.5)+'px, -'+(0)+'px)' );
        el.hover( function(event)
                       {
                           event.preventDefault();
                           e = $(this);
                           ( function( e, it ) {
                               //e.addClass("in");
                               //tfm = 'rotate('+ 0 + 'deg) ' ;
                               //tfm += 'translate('+(0)+'px, '+(0)+'px)';
                               e.css("width", "125px");
                               e.css("z-index", "50");
                               e.css("left", it.x + 'px' );
                               e.css("top", it.y + 'px' );
                                   
                               e.css("transformOrigin", 'top left');
                               e.css("transform", 'rotate('+(it.rotation-90)+'deg) ' +
                                                  'translate(-'+(125*.5)+'px, -'+(0)+'px)' );
                               //e.removeClass("in");
                               //e.addClass("out");
                               //e.css("transform", tfm);
                               
                               //e.css("left", (tx-(e.width()*.5)) + 'px' )
                               //.css("top", (ty-(e.height()*.5)) + 'px' );
                           } )( e, it )
                       },
                //);
        /*el.mouseout(*/ function(event)
                       {
                           event.preventDefault();
                           e = $(this);
                           
                           ( function( e, it ) {
                                   
                                   e.css("left", it.x + 'px' );
                                   e.css("top", it.y + 'px' );
                                   e.css("width", "75px");
                                   e.css("z-index", "10");
                                   e.css("transformOrigin", 'top left');
                                   e.css("transform", 'rotate('+(it.rotation-90)+'deg) ' +
                                                       'translate(-'+(it.width*.5)+'px, -'+(0)+'px)' );
                           })( e, it )
                       }
               );
    }
    //
    //
    function item( x, y, width, height, el )
    {
        this.rotation = 0;
        this.x = x;
        this.y = y;
        this.width  = width;
        this.height = height;
        this.element = el;
    }
    //
    //
    function ring( cir, r, ds, de )
    {
        this.cx = cir.center_x;
        this.cy = cir.center_y;
        this.degree_s = cir.degree_s;
        this.degree_e = cir.degree_e;
        this.radius = r;
        this.maxitems = 0;
        this.items = [ ];
        
        this.reposition = function( )
        {
            //The angle between the items.
           //FIXME: maxitems needs to be switchable with numitems
           var angle_step = 2 * Math.PI / this.maxitems;
           
           for( var i=0; i < this.items.length; i++ )
           {
               var it = this.items[ i ];
               //The angle of the current item.
               var   a = (angle_step * i) + (this.degree_s*(Math.PI/180));
               console.log( "angle:" + (angle_step * i) + " " + (this.degree_s*(Math.PI/180)) );
               //var ad = (a*(180/Math.PI));
               //console.log( ad + "" );
               //if( ad > cir.degree_e )
               //{
                   //this.items.splice( i, 1 );
                   
                   //return 1;
               //}
               //The position along the circle
               var ptx = this.radius * Math.cos( a );
               var pty = this.radius * Math.sin( a );
               
               it.rotation = a * (180/Math.PI);//Math.atan2(pty, ptx) * 180 / Math.PI;
               
               it.x = ptx + cx;
               it.y = pty + cy;
               
               position_item( it );
           }
        }
        
        this.add_item = function( element )
        {
           if( this.items.length === this.maxitems ) return 1;
           
           this.items.push( new item( 0,0,75,75,element ) );
           
           //this.reposition( );
           //The angle between the items.
           //FIXME: maxitems needs to be switchable with numitems
           var angle_step = 2 * Math.PI / this.maxitems;
           
           for( var i=0; i < this.items.length; i++ )
           {
               var it = this.items[ i ];
               //The angle of the current item.
               var   a = (angle_step * i) + (this.degree_s*(Math.PI/180));
               //console.log( a + " " + this.degree_e );
               var ad = (a*(180/Math.PI));
               //console.log( ad + "" );
               if( ad > this.degree_e )
               {
                   this.items.splice( i, 1 );
                   var er = this.degree_e - this.items[ i-1 ].rotation;
                   var pr = this.degree_e - this.degree_s; // total arc span
                   
                   this.degree_s = er*.5;
                   this.degree_e = this.degree_s + pr;
                   console.log( "now:" + this.degree_s + " " + this.degree_e );
                   return 1;
               }
               //The position along the circle
               //var ptx = this.radius * Math.cos( a );
               //var pty = this.radius * Math.sin( a );
               
               //it.rotation = Math.atan2(pty, ptx) * 180 / Math.PI;
               
               //it.x = ptx + cx;
               //it.y = pty + cy;
               
               //position_item( it );
           }
           this.reposition( );
           return 0;
        };
    }
    //
    //
    function radius_next( r, maxitems, targetlength )
    {
        for( ; ; )
        {
            if( length_of_side_inradius( r, maxitems ) > targetlength )
            {
                maxitems = maxitems + 1;
            }
            else
            {
                return maxitems;
            }
        }
    }
    //"Public variables"
    this.maxitems = targetitems;
    this.center_x = cx;
    this.center_y = cy;
    
    this.inradius = min_r;
    this.circumradius = max_r;
    
    this.degree_s = min_d;
    this.degree_e = max_d;
    
    this.tile_normal_width = length_of_side_inradius( this.inradius, this.maxitems );
    this.tile_larger_width = 0;
    this.tile_normal_height = 0;
    this.tile_larger_height = 0;
    
    this.rings = [ ];
    //this.items = [ ];
    this.add_item = function( element )
    {
        if( this.rings.length === 0 )
        {
            //The radius needs to be determined before hand, within our min/max
            var r = new ring( this, this.inradius, this.degree_s, this.degree_e );
            this.rings.push( r );
            r.maxitems = this.maxitems;
        }
        //alert( this.rings.length );
        if( this.rings[ this.rings.length -1 ].add_item( element ) === 1 )
        {
            var pr = this.rings[ this.rings.length -1 ];
            pr.reposition( );
            if( (pr.radius + 80) > this.circumradius )
            {
                return 1;
            }
            var r = new ring( this, pr.radius + 80, this.degree_s, this.degree_e );
            this.rings.push( r );
            r.maxitems = radius_next( pr.radius + 80, this.maxitems, 75 );
            this.rings[ this.rings.length -1 ].add_item( element )
        }
   	   //this.items.push( element );
    };
}

$(document).ready(function()
    {
    
    var sw = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var sh = (window.innerHeight > 0) ? window.innerHeight : screen.height;

    var cir = new circlemosaic( 100, 100, 230, 800, 0, 90, 20 );


    var $items = $("#diagram2").children();
    //console.log( JSON.stringify( $items ));
    $items.each(function (idx, el)
    {
        cir.add_item( el );
    });
    
//console.log( JSON.stringify(cir, null, 4) );
    });
