//==============================================================================
// Library class for reading/writing to firebase
//
//============================================================================== 

//============================================================================== 
var DataStore = function(root)
{
    this._watcher = "undefined";
	
	var config = {
		apiKey: "AIzaSyA-CBk6tpB3apaf1p3kxfhIBsNJ4wVYKTM",
		authDomain: "phelpstown.firebaseapp.com",
		databaseURL: "https://phelpstown.firebaseio.com",
		storageBucket: "firebase-phelpstown.appspot.com",
	};
	firebase.initializeApp(config);
    this._firebase_ref = firebase.database().ref();
}

//============================================================================== 
DataStore.prototype.GetRef = function( root )
{
    return firebase.database().ref( root );
}

//============================================================================== 
DataStore.prototype.ReadAsArray = function( root, context, callback )
{
    var ref = this.GetRef( root );
    var array = context( ref );

    array.$loaded( function( data )
    {
        callback( data );
    });
}

//==============================================================================
DataStore.prototype.ReadValue = function( root, context, callback )
{
    var ref = this.GetRef( root );
    var obj = context( ref );

   obj.$loaded().then(function() {
       callback(obj.$value);
   });
}
//==============================================================================
DataStore.prototype.Write = function( entry, root )
{
    var ref = this.GetRef( root );
    ref.update( entry );
}

//==============================================================================
DataStore.prototype.Push = function( entry, root )
{
    var ref = this.GetRef( root );

    ref.push( entry );
}

//==============================================================================
DataStore.prototype.RegisterWatcher = function( root, context, callback )
{
    var ref = this.GetRef( root );
    var obj = context( ref );

    this._watcher = obj.$watch(function() {
        callback( obj.$value );
    });
}

//==============================================================================
DataStore.prototype.RegisterChildWatcher = function( root, context, callback )
{
    var ref = this.GetRef( root );
    var obj = context( ref );

    this._watcher = obj.$watch(function() {
        callback( obj );
    });
}

//==============================================================================
DataStore.prototype.RegisterTimer = function( game, offset, running, end_time )
{
    var timer_ref = this.GetRef( game + "/Timer" );
    var running_ref = this.GetRef( game + "/Night" );
    var offset_ref = this.GetRef( ".info/serverTimeOffset" );

    timer_ref.on( "value", end_time );
    running_ref.on( "value", running );
    offset_ref.on( "value", offset );
}

//==============================================================================
DataStore.prototype.StartTimer = function( game, offset )
{
    var timer_ref = this.GetRef( game + "/Timer" );
    var running_ref = this.GetRef( game + "/Night" );

    running_ref.set( true );
    timer_ref.set(Date.now() + offset + 120 * 1000);
}

//==============================================================================
DataStore.prototype.ListenForAdds = function( root, callback )
{
    var ref = this.GetRef( root );
    ref.on('child_added', function(data) {
        callback( data ); 
    });
}

//==============================================================================
DataStore.prototype.ListenForAddsOnRoot = function(callback )
{
    var ref = firebase.database().ref();
    ref.on('child_added', function(data) {
        callback( data ); 
    });
}

//==============================================================================
DataStore.prototype.ListenForChanges = function( root, callback )
{
    var ref = this.GetRef( root );
    ref.on('child_changed', function(data, prev_data) {
        callback( data ); 
    });
}

//==============================================================================
DataStore.prototype.ListenForAllChanges = function( callback )
{
    var ref = firebase.database().ref();
    ref.on('child_changed', function(data, prev_data) {
        callback( data ); 
    });
}

//==============================================================================
DataStore.prototype.Read = function( root )
{
    var ref = this.GetRef( root );

    return ref;
}

//==============================================================================
DataStore.prototype.StopTimer = function( game )
{
    var timer_ref = this.GetRef( game + "/Timer" );
    var running_ref = this.GetRef( game + "/Night" );

    running_ref.set( false );
    timer_ref.set(0);
}

FirebaseStore = new DataStore("");