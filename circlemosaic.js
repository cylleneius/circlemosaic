
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
        el.css("position", "absolute");
        el.css("left", it.x + 'px' );
        el.css("top", it.y + 'px' );
        //console.log( JSON.stringify( it, null, 4 ));
        el.css("transformOrigin", 'top left');
        el.css("transform", 'rotate('+(it.rotation-90)+'deg) ' +
                             'translate(-'+(it.width*.5)+'px, -'+(0)+'px)' );
        el.hover( function(event)
                       {
                           event.preventDefault();
                           e = $(this);
                           ( function( e, it ) {

                               e.css("width", it.l_width +'px');
                               e.css("z-index", "50");
                               e.css("left", it.x + 'px' );
                               e.css("top", it.y + 'px' );
                                   
                               e.css("transformOrigin", 'top left');
                               e.css("transform", 'rotate('+(it.rotation-90)+'deg) ' +
                                                  'translate(-'+(125*.5)+'px, -'+(0)+'px)' );
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
                                   e.css("width", it.width + 'px');
                                   e.css("z-index", "10");
                                   e.css("transformOrigin", 'top left');
                                   e.css("transform", 'rotate('+(it.rotation-90)+'deg) ' +
                                                      'translate(-'+(it.width*.5)+'px, -'+(0)+'px)' );
                           })( e, it )
                       }
               );
    }
    //
    //FIXME: item needs to be moved to a container object, since circlemosaic is
    //       a layout (for a container of items)
    function item( x, y, width, height, el )
    {
        this.rotation = 0;
        this.x = x;
        this.y = y;
        this.width  = width;
        this.height = height;
        this.l_width  = width;
        this.l_height = height;
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
               //console.log( "angle:" + (angle_step * i) + " " + (this.degree_s*(Math.PI/180)) );
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
               //console.log( ptx + " " + pty + " : " + cx + " " + cy + " : " + cir.center_x + " " +cir.center_y);
               it.x = ptx + cir.center_x;
               it.y = pty + cir.center_y;
               
               position_item( it );
           }
        }
        
        this.add_item = function( element )
        {
           if( this.items.length === this.maxitems ) return 1;
           //console.log(JSON.stringify( this, null, 4));
           this.items.push( new item( 0,0,cir.tile_normal_width,cir.tile_normal_height,element ) );
           
           //The angle between the items.
           //FIXME: maxitems needs to be switchable with numitems
           var angle_step = 2 * Math.PI / this.maxitems;
           
           for( var i=0; i < this.items.length; i++ )
           {
               var it = this.items[ i ];
               //The angle of the current item.
               var   a = (angle_step * i) + (this.degree_s*(Math.PI/180));
                                          
               
               var ad = (a*(180/Math.PI));
               
               if( ad > this.degree_e )
               {
                   this.items.splice( i, 1 );
                   var er = this.degree_e - this.items[ i-1 ].rotation;
                   var pr = this.degree_e - this.degree_s; // total arc span
                   
                   this.degree_s = er*.5 + ((angle_step * .5)*(180/Math.PI));
                   this.degree_e = this.degree_s + pr;
                   //console.log( "now:" + this.degree_s + " " + this.degree_e );
                   //Loop through arc and prune the elements out of range
                   return 1;
               }
               
           }
           this.reposition( );
           return 0;
        };
    }
    //
    //
    function find_numitems_for_radius( r, targetlength )
    {
        var items = 5;
        for( ; ; )
        {
            if( length_of_side_inradius( r, items ) > targetlength )
            {
                items = items + 1;
            }
            else
            {
                return items;
            }
        }
    }
    //"Public variables"
    if( targetitems !== "auto" )
        this.maxitems = targetitems;
    else
    {
        //FIXME: This makes no sense. (max items is minimum radius?)
        this.maxitems = find_numitems_for_radius( min_r, 75 );
    }
    this.center_x = cx;
    this.center_y = cy;
    
    this.inradius = min_r;
    this.circumradius = max_r;
    
    this.degree_s = min_d;
    this.degree_e = max_d;
    
    this.tile_normal_width = 75;
    this.tile_larger_width = 0;
    this.tile_normal_height = 75;
    this.tile_larger_height = 0;
    
    this.total_height = 0;
    this.rings = [ ];
    
    this.con = null;
    
    this.layout = function( con )
    {
        this.con = con;
        //FIXME: workaround for now. refactor later.
        for( var i =0; i < this.con.items.length; i++ )
        {
            this.add_item( this.con.items[ i ].element );
        }
    }
    //this.items = [ ];
    this.add_item = function( element )
    {
        if( this.rings.length === 0 )
        {
            //The radius needs to be determined before hand, within our min/max
            var r = new ring( this, this.inradius, this.degree_s, this.degree_e );
            this.rings.push( r );
            r.maxitems = this.maxitems;
            this.total_height = this.tile_normal_height;
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
            r.maxitems = find_numitems_for_radius( pr.radius + 80, this.tile_normal_width );
            this.rings[ this.rings.length -1 ].add_item( element );
            this.total_height = this.total_height + this.tile_normal_height;
        }
   	   //this.items.push( element );
    };
    this.reposition = function ()
    {
        for( var i = 0; i < this.rings.length; i++ )
        {
            this.rings[ i ].reposition();
        }
    }
}


