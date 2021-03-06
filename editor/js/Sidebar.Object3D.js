/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Object3D = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/object3d/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {

		editor.config.setKey( 'ui/sidebar/object3d/collapsed', boolean );

	} );
	container.setDisplay( 'none' );

	var objectType = new UI.Text().setTextTransform( 'uppercase' );
	container.addStatic( objectType );
	container.add( new UI.Break() );

	// uuid

	var objectUUIDRow = new UI.Panel();
	var objectUUID = new UI.Input().setWidth( '115px' ).setColor( '#444' ).setFontSize( '12px' ).setDisabled( true );
	var objectUUIDRenew = new UI.Button( '⟳' ).setMarginLeft( '7px' ).onClick( function () {

		objectUUID.setValue( THREE.Math.generateUUID() );

		editor.selected.uuid = objectUUID.getValue();

	} );

	objectUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	objectUUIDRow.add( objectUUID );
	objectUUIDRow.add( objectUUIDRenew );

	container.add( objectUUIDRow );

	// ID

	var objectMeshIDRow = new UI.Panel();
	var objectMeshID = new UI.Input().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange(
		function () {

		editor.setObjectMeshID( editor.selected, objectMeshID.getValue() );

   }

	);

	objectMeshIDRow.add( new UI.Text( 'ID' ).setWidth( '90px' ) );
	objectMeshIDRow.add( objectMeshID );

	container.add( objectMeshIDRow );


	// name

	var objectNameRow = new UI.Panel();
	var objectName = new UI.Input().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( function () {

			editor.setObjectName( editor.selected, objectName.getValue() );

	} );

	objectNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	objectNameRow.add( objectName );

	container.add( objectNameRow );

	// parent

	var objectParentRow = new UI.Panel();
	var objectParent = new UI.Select().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px').onChange( update );

	objectParentRow.add( new UI.Text( 'Parent' ).setWidth( '90px' ) );
	objectParentRow.add( objectParent );

	container.add( objectParentRow );
	// Groups

	var objectGroupsRow = new UI.Panel();
	var objectGroups = new UI.Select().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );

	objectGroupsRow.add( new UI.Text( 'GROUPS' ).setWidth( '90px' ) );
	objectGroupsRow.add( objectGroups );

	container.add( objectGroupsRow );
	// Group

	/*var objectGroupRow = new UI.Panel();
	var objectGroup = new UI.Select().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );

	objectGroupRow.add( new UI.Text( 'Group' ).setWidth( '90px' ) );
	objectGroupRow.add( objectGroup );

	container.add( objectGroupRow );*/
	// INFO

	var INFORow = new UI.Panel();
	var INFO = new UI.Input().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange(
		function () {

			editor.setINFO( editor.selected, INFO.getValue() );

		}

	);

	INFORow.add( new UI.Text( 'INFO' ).setWidth( '90px' ) );
	INFORow.add( INFO );

	container.add( INFORow );

	// position

	var objectPositionRow = new UI.Panel();
	var objectPositionX = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectPositionY = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectPositionZ = new UI.Number().setWidth( '50px' ).onChange( update );

	objectPositionRow.add( new UI.Text( 'Position' ).setWidth( '90px' ) );
	objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );

	container.add( objectPositionRow );

	// rotation

	var objectRotationRow = new UI.Panel();
	var objectRotationX = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectRotationY = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectRotationZ = new UI.Number().setWidth( '50px' ).onChange( update );

	objectRotationRow.add( new UI.Text( 'Rotation' ).setWidth( '90px' ) );
	objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

	container.add( objectRotationRow );

	// scale

	var objectScaleRow = new UI.Panel();
	var objectScaleLock = new UI.Checkbox().setPosition( 'absolute' ).setLeft( '75px' );
	var objectScaleX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleX );
	var objectScaleY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleY );
	var objectScaleZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleZ );

	objectScaleRow.add( new UI.Text( 'Scale' ).setWidth( '90px' ) );
	objectScaleRow.add( objectScaleLock );
	objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );

	container.add( objectScaleRow );

	// fov

	var objectFovRow = new UI.Panel();
	var objectFov = new UI.Number().onChange( update );

	objectFovRow.add( new UI.Text( 'Fov' ).setWidth( '90px' ) );
	objectFovRow.add( objectFov );

	container.add( objectFovRow );

	// near

	var objectNearRow = new UI.Panel();
	var objectNear = new UI.Number().onChange( update );

	objectNearRow.add( new UI.Text( 'Near' ).setWidth( '90px' ) );
	objectNearRow.add( objectNear );

	container.add( objectNearRow );

	// far

	var objectFarRow = new UI.Panel();
	var objectFar = new UI.Number().onChange( update );

	objectFarRow.add( new UI.Text( 'Far' ).setWidth( '90px' ) );
	objectFarRow.add( objectFar );

	container.add( objectFarRow );

	// intensity

	var objectIntensityRow = new UI.Panel();
	var objectIntensity = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectIntensityRow.add( new UI.Text( 'Intensity' ).setWidth( '90px' ) );
	objectIntensityRow.add( objectIntensity );

	container.add( objectIntensityRow );

	// color

	var objectColorRow = new UI.Panel();
	var objectColor = new UI.Color().onChange( update );

	objectColorRow.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
	objectColorRow.add( objectColor );

	container.add( objectColorRow );

	// ground color

	var objectGroundColorRow = new UI.Panel();
	var objectGroundColor = new UI.Color().onChange( update );

	objectGroundColorRow.add( new UI.Text( 'Ground color' ).setWidth( '90px' ) );
	objectGroundColorRow.add( objectGroundColor );

	container.add( objectGroundColorRow );

	// distance

	var objectDistanceRow = new UI.Panel();
	var objectDistance = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectDistanceRow.add( new UI.Text( 'Distance' ).setWidth( '90px' ) );
	objectDistanceRow.add( objectDistance );

	container.add( objectDistanceRow );

	// angle

	var objectAngleRow = new UI.Panel();
	var objectAngle = new UI.Number().setPrecision( 3 ).setRange( 0, Math.PI / 2 ).onChange( update );

	objectAngleRow.add( new UI.Text( 'Angle' ).setWidth( '90px' ) );
	objectAngleRow.add( objectAngle );

	container.add( objectAngleRow );

	// exponent

	var objectExponentRow = new UI.Panel();
	var objectExponent = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectExponentRow.add( new UI.Text( 'Exponent' ).setWidth( '90px' ) );
	objectExponentRow.add( objectExponent );

	container.add( objectExponentRow );

	// visible

	var objectVisibleRow = new UI.Panel();
	var objectVisible = new UI.Checkbox().onChange( update );

	objectVisibleRow.add( new UI.Text( 'Visible' ).setWidth( '90px' ) );
	objectVisibleRow.add( objectVisible );

	container.add( objectVisibleRow );


	function updateScaleX() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleX.getValue() / object.scale.x;

			objectScaleY.setValue( objectScaleY.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleY() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleY.getValue() / object.scale.y;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleZ() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleZ.getValue() / object.scale.z;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleY.setValue( objectScaleY.getValue() * scale );

		}

		update();

	}

	function update() {

		var object = editor.selected;

		if ( object !== null ) {

			if ( object.parent !== undefined ) {

				var newParentId = parseInt( objectParent.getValue() );

				if ( object.parent.id !== newParentId && object.id !== newParentId ) {

					editor.parent( object, editor.scene.getObjectById( newParentId, true ) );

				}

			}
			// Group
			/*var Groups = editor.scene.Groups;
			if ( Groups.length>=3 ) {

				// use name better
				var GroupSelectedId = parseInt( objectGroups.getValue() );
				editor.scene.GroupSelectedId=GroupSelectedId;
				var GroupSelected = scene.Groups[editor.scene.GroupSelectedId];
				var options = {};
				for(var i=0;i<GroupSelected.Group.length;++i)
				{
					options[ GroupSelected.Group[i].Id] = GroupSelected.Group.Name;
				}

				objectGroup.setOptions( options );
				objectGroup.setValue(1);
			}*/
			object.position.x = objectPositionX.getValue();
			object.position.y = objectPositionY.getValue();
			object.position.z = objectPositionZ.getValue();

			object.rotation.x = objectRotationX.getValue();
			object.rotation.y = objectRotationY.getValue();
			object.rotation.z = objectRotationZ.getValue();

			object.scale.x = objectScaleX.getValue();
			object.scale.y = objectScaleY.getValue();
			object.scale.z = objectScaleZ.getValue();

			if ( object.fov !== undefined ) {

				object.fov = objectFov.getValue();
				object.updateProjectionMatrix();

			}

			if ( object.near !== undefined ) {

				object.near = objectNear.getValue();

			}

			if ( object.far !== undefined ) {

				object.far = objectFar.getValue();

			}

			if ( object.intensity !== undefined ) {

				object.intensity = objectIntensity.getValue();

			}

			if ( object.color !== undefined ) {

				object.color.setHex( objectColor.getHexValue() );

			}

			if ( object.groundColor !== undefined ) {

				object.groundColor.setHex( objectGroundColor.getHexValue() );

			}

			if ( object.distance !== undefined ) {

				object.distance = objectDistance.getValue();

			}

			if ( object.angle !== undefined ) {

				object.angle = objectAngle.getValue();

			}

			if ( object.exponent !== undefined ) {

				object.exponent = objectExponent.getValue();

			}

			object.visible = objectVisible.getValue();

			try {

				object.userData = JSON.parse( objectUserData.getValue() );

			} catch ( exception ) {

				console.warn( exception );

			}

			signals.objectChanged.dispatch( object );

		}

	}

	function updateRows( object ) {

		var properties = {
			'parent': objectParentRow,
			'fov': objectFovRow,
			'near': objectNearRow,
			'far': objectFarRow,
			'intensity': objectIntensityRow,
			'color': objectColorRow,
			'groundColor': objectGroundColorRow,
			'distance' : objectDistanceRow,
			'angle' : objectAngleRow,
			'exponent' : objectExponentRow
		};

		for ( var property in properties ) {

			properties[ property ].setDisplay( object[ property ] !== undefined ? '' : 'none' );

		}

	}

	function updateTransformRows( object ) {

		if ( object instanceof THREE.Light ||
		   ( object instanceof THREE.Object3D && object.userData.targetInverse ) ) {

			objectRotationRow.setDisplay( 'none' );
			objectScaleRow.setDisplay( 'none' );

		} else {

			objectRotationRow.setDisplay( '' );
			objectScaleRow.setDisplay( '' );

		}

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null ) {

			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;
		var options = {};

		scene.traverse( function ( object ) {

			options[ object.id ] = object.name;

		} );

		objectParent.setOptions( options );

	} );

	// Groups
	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;
		var options = {};

		for(var i=0;i<scene.Groups.length;++i)
		{
			options[ scene.Groups[i].Id] = scene.Groups[i].Name;
		}

		objectGroups.setOptions( options );

	} );

	// Group   when??
/*
	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;
		var GroupSelected = scene.Groups[scene.GroupSelectedId];
		var options = {};

		for(var i=0;i<GroupSelected.Group.length;++i)
		{
			options[ GroupSelected.Group[i].Id] = GroupSelected.Group.Name;
		}

		objectGroup.setOptions( options );

	} );
*/

	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	function updateUI( object ) {

		objectType.setValue( object.type );

		objectUUID.setValue( object.uuid );

		INFO.setValue( object.info );

		objectMeshID.setValue( object.myId );

		if ( object.parent !== undefined ) {

			objectParent.setValue( 0 );

		}
		// Group
		//objectGroups.setValue( editor.scene.GroupSelectedId );
		//objectGroup.setValue( editor.scene.GroupSelectedId );

		objectPositionX.setValue( object.position.x );
		objectPositionY.setValue( object.position.y );
		objectPositionZ.setValue( object.position.z );

		objectRotationX.setValue( object.rotation.x );
		objectRotationY.setValue( object.rotation.y );
		objectRotationZ.setValue( object.rotation.z );

		objectScaleX.setValue( object.scale.x );
		objectScaleY.setValue( object.scale.y );
		objectScaleZ.setValue( object.scale.z );

		if ( object.fov !== undefined ) {

			objectFov.setValue( object.fov );

		}

		if ( object.near !== undefined ) {

			objectNear.setValue( object.near );

		}

		if ( object.far !== undefined ) {

			objectFar.setValue( object.far );

		}

		if ( object.intensity !== undefined ) {

			objectIntensity.setValue( object.intensity );

		}

		if ( object.color !== undefined ) {

			objectColor.setHexValue( object.color.getHexString() );

		}

		if ( object.groundColor !== undefined ) {

			objectGroundColor.setHexValue( object.groundColor.getHexString() );

		}

		if ( object.distance !== undefined ) {

			objectDistance.setValue( object.distance );

		}

		if ( object.angle !== undefined ) {

			objectAngle.setValue( object.angle );

		}

		if ( object.exponent !== undefined ) {

			objectExponent.setValue( object.exponent );

		}

		objectVisible.setValue( object.visible );

		try {

			objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );

		} catch ( error ) {

			console.log( error );

		}

		objectUserData.setBorderColor( '#ccc' );
		objectUserData.setBackgroundColor( '' );

		updateTransformRows( object );

	}

	return container;

}
