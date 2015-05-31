
function container( )
{
    this.items = [ ];
    this.add_item = function( i )
    {
        this.items.push( i );
        return this.items.length;
    }
    this.add = function( el )
    {
        //FIXME: figure something else out for the max w/h
        var w = $( el ).innerWidth();
        var h = $( el ).innerHeight();
        this.add_item( new item( 0, 0, w, h, w*2, h*2, el ) );
    }
    this.remove = function( i )
    {
        var r = this.items.splice( i, 1 );
        console.log( JSON.stringify( r, null, 4) + ":::" + JSON.stringify( i, null, 4) + ":::" + JSON.stringify( this.items, null, 4) );
    }
}

function item( x, y, width, height, l_width, l_height,el )
{
    this.rotation = 0;
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;
    this.l_width  = l_width;
    this.l_height = l_height;
    this.element = el;
}
