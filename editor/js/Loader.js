
var Loader = function ( editor ) {

	var scope = this;
	var signals = editor.signals;

	this.loadFile = function ( file,className ) {

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		switch ( extension ) {

			case 'obj':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {



					var contents = event.target.result;
					// 重构contents内容 ？？
					var object = new THREE.OBJLoader().parse( contents );

					object.myObjFileType =extension;
					object.myObjPath = filename;
					object.myObjType = "Object";
					object.myId = object.uuid.substr(0,8);
					object.myObjId = object.uuid.substr(0,8);
					switch (className)
					{
						//Block,MPoint,Brand,Group
						case 'Block':
							object.name = 'Object-'+object.uuid.substr(0,4);
							object.children[0].name = 'Block-'+object.children[0].uuid.substr(0,1);
							object.children[0].myModelType = 'Block';
							editor.scene.BlockGroup.Group.push(object);
							break;
						case 'MPoint':
							object.name = 'Object-'+object.uuid.substr(0,4);
							object.children[0].name = 'MPoint-'+object.children[0].uuid.substr(0,1);
							object.children[0].myModelType = 'MPoint';
							//type="temperature" 可自定义
							object.children[0].myMPointType = 'temperature';
							editor.scene.MPointGroup.Group.push(object);
							break;
						case 'Brand':
							object.name = 'Object-'+object.uuid.substr(0,4);
							object.children[0].name = 'Brand-'+object.children[0].uuid.substr(0,1);
							object.children[0].myModelType = 'Brand';
							editor.scene.BrandGroup.Group.push(object);
							break;
						case 'ObjectMeshs'://???
							object.myObjType = 'ObjectMeshs';
							object.name = 'ObjectMeshs-'+object.uuid.substr(0,4);
							break;
						default :
							alert( 'Loader error' );
							break;
					}
					editor.addObject( object );//只有sence中的数据持久化的
					editor.select( object );

				}, false );
				reader.readAsText( file );

				break;
				THREE.Scene()
			case 'js':
			case 'json':

			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					// 2.0

					if ( contents.indexOf( 'postMessage' ) !== -1 ) {

						var blob = new Blob( [ contents ], { type: 'text/javascript' } );
						var url = URL.createObjectURL( blob );

						var worker = new Worker( url );

						worker.onmessage = function ( event ) {

							event.data.metadata = { version: 2 };
							handleJSON( event.data, file, filename );

						};

						worker.postMessage( Date.now() );

						return;

					}

					// >= 3.0

					var data;

					try {

						data = JSON.parse( contents );

					} catch ( error ) {

						alert( error );
						return;

					}

					handleJSON( data, file, filename );

				}, false );
				reader.readAsText( file );

				break;


			default:

				alert( 'Unsupported file format (' + extension +  ').' );

				break;

		}

	}

	var handleJSON = function ( data, file, filename ) {

		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.version === undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		if ( data.metadata.type === 'BufferGeometry' ) {

			var loader = new THREE.BufferGeometryLoader();
			var result = loader.parse( data );

			var mesh = new THREE.Mesh( result );

			editor.addObject( mesh );
			editor.select( mesh );

		} else if ( data.metadata.type.toLowerCase() === 'geometry' ) {

			var loader = new THREE.JSONLoader();
			var result = loader.parse( data );

			var geometry = result.geometry;
			var material;

			if ( result.materials !== undefined ) {

				if ( result.materials.length > 1 ) {

					material = new THREE.MeshFaceMaterial( result.materials );

				} else {

					material = result.materials[ 0 ];

				}

			} else {

				material = new THREE.MeshPhongMaterial();

			}

			geometry.sourceType = "ascii";
			geometry.sourceFile = file.name;

			var mesh;

			if ( geometry.animation && geometry.animation.hierarchy ) {

				mesh = new THREE.SkinnedMesh( geometry, material );

			} else {

				mesh = new THREE.Mesh( geometry, material );

			}

			mesh.name = filename;

			editor.addObject( mesh );
			editor.select( mesh );

		} else if ( data.metadata.type.toLowerCase() === 'object' ) {

			var loader = new THREE.ObjectLoader();
			var result = loader.parse( data );

			if ( result instanceof THREE.Scene ) {

				editor.setScene( result );

			} else {

				editor.addObject( result );
				editor.select( result );

			}

		} else if ( data.metadata.type.toLowerCase() === 'scene' ) {

			// DEPRECATED

			var loader = new THREE.SceneLoader();
			loader.parse( data, function ( result ) {

				editor.setScene( result.scene );

			}, '' );

		}

	};

}
