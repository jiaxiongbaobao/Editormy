/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'File' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'New' );
	option.onClick( function () {

		if ( confirm( 'Are you sure?' ) ) {

			editor.config.setKey(
				'camera/position', [ 500, 250, 500 ],
				'camera/target', [ 0, 0, 0 ]
			);

			editor.storage.clear( function () {

				location.href = location.pathname;

			} );

		}

	} );
	options.add( option );

	// 导入Block
	//Block,MPoint,Brand,Group
	var BlockFileInput = document.createElement( 'input' );
	BlockFileInput.type = 'file';

	BlockFileInput.addEventListener( 'change', function ( event ) {

		editor.loader.loadFile( BlockFileInput.files[ 0 ],'Block' );

	} );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Import Block' );
	var a=1;
	option.onClick( function () {

		BlockFileInput.click();
	} );
	options.add( option );

	// 导入测点
	var MPointFileInput = document.createElement( 'input' );
	MPointFileInput.type = 'file';
	MPointFileInput.addEventListener( 'change', function ( event ) {

		editor.loader.loadFile( MPointFileInput.files[ 0 ],'MPoint');

	} );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Import MPoint ' );
	option.onClick( function () {

		MPointFileInput.click();

	} );
	options.add( option );
	// 导入广告
	var BrandFileInput = document.createElement( 'input' );
	BrandFileInput.type = 'file';
	BrandFileInput.addEventListener( 'change', function ( event ) {

		editor.loader.loadFile( BrandFileInput.files[ 0 ],'Brand');

	} );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Import Brand ' );
	option.onClick( function () {

		BrandFileInput.click();

	} );
	options.add( option );
	// 导入ObjectMeshs
/*	var BrandFileInput = document.createElement( 'input' );
	BrandFileInput.type = 'file';
	BrandFileInput.addEventListener( 'change', function ( event ) {

		editor.loader.loadFile( BrandFileInput.files[ 0 ],'Object');

	} );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Import ObjectMs' );
	option.onClick( function () {

		BrandFileInput.click();

	} );
	options.add( option );*/
   // RGB 转换 16进制
	function rgb2hex(rgb) {
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "#" + hex(rgb.r).toUpperCase() + hex(rgb.g).toUpperCase() + hex(rgb.b).toUpperCase();
	}
	function trans() {
		this.x = '';
		this.y = '';
		this.z = '';
	}
	function getPosition(obj,objChild)
	{

		var tes =new trans();
		tes.x=obj.x+objChild.x;
		tes.y=obj.y+objChild.y;
		tes.z=obj.z+objChild.z;
		return tes;
	}
	function getRotation(obj,objChild)
	{
		var tes =new trans();
		tes.x=obj._x+objChild._x;
		tes.y=obj._y+objChild._y;
		tes.z=obj._z+objChild._z;
		return tes;
		//tes.x=objChild._x!=0?objChild._x:obj._x;
		//tes.x=objChild._y!=0?objChild._y:obj._y;
		//tes.x=objChild._z!=0?objChild._z:obj._z;
		//return tes;
	}
	function getScale(obj,objChild)
	{
		var tes =new trans();
		tes.x=obj.x*objChild.x;
		tes.y=obj.y*objChild.y;
		tes.z=obj.z*objChild.z;
		return tes;
	}
	// Export Scene
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export Floor' );
	option.onClick(
		function ()
		{

			var output = editor.scene;

			var FloorId = output.uuid;
			var FloorName = output.name;
				var content ="<Floor id=\""+FloorId+"\" "+" name =\""+FloorName+"\"> \n";
					content+="	\<BlockList>\n";
			for(var i=0;i<output.children.length;++i)
			{

				if(output.children[i].children[0].myModelType=="Block")
				{
					var Id=output.children[i].myObjId;
					var Name=output.children[i].name;
					var Path=output.children[i].myObjPath;
					var Type=output.children[i].myObjFileType;

					var Position=getPosition(output.children[i].position,output.children[i].children[0].position);
					var Rotation=getRotation(output.children[i].rotation,output.children[i].children[0].rotation);
					var Scale=getScale(output.children[i].scale,output.children[i].children[0].scale);
					//var Texture=rgb2hex(output.children[i].children[0].myColor);
					var Texture=output.children[i].children[0].myColor.toUpperCase();
					var Info=output.children[i].info;

					content+="		<Block id=\""+Id+"\" name=\""+Name+"\"> \n";
					content+="			<model path=\"./data/models/"+Path+"\" type=\""+Type+"\" /> \n";
					content+="			<position px=\""+Position.x+" \" py=\""+Position.y+"\" pz=\""+Position.z+"\" />\n";
					content+="			<rotation px=\""+Rotation.x+"\" py=\""+Rotation.y+"\" pz=\""+Rotation.z+"\" />\n";
					content+="			<scale px=\""+Scale.x+"\" py=\""+Scale.y+"\" pz=\""+Scale.z+"\" />\n";
					content+="			<texture color=\""+Texture+"\" />\n";
					content+="			\<info> "+Info+" \</info>\n";//<info>我是地板</info>
					content+="		\</Block>\n";
				}

			}
					content+="	\</BlockList>\n";
					content+="	\<MPointList>\n";
			for(var i=0;i<output.children.length;++i)
			{

				if(output.children[i].children[0].myModelType=="MPoint")
				{
					//type="temperature"
					var Id=output.children[i].myObjId;
					var Name=output.children[i].name;
					var Path=output.children[i].myObjPath;
					var Type=output.children[i].myObjType;
					var MPointType=output.children[i].children[0].myMPointType;

					var Position=getPosition(output.children[i].position,output.children[i].children[0].position);
					var Rotation=getRotation(output.children[i].rotation,output.children[i].children[0].rotation);
					var Scale=getScale(output.children[i].scale,output.children[i].children[0].scale);
					//var Texture=rgb2hex(output.children[i].children[0].myColor);
					var Texture=output.children[i].children[0].myColor.toUpperCase();
					var Info=output.children[i].info;

					content+="		<MPoint id=\""+Id+"\" name=\""+Name+"\" type=\""+MPointType+"\" />\n";
					content+="			<model path=\"./data/models/"+Path+"\" type=\""+Type+"\" /> \n";
					content+="			<position px=\""+Position.x+" \" py=\""+Position.y+"\" pz=\""+Position.z+"\" />\n";
					content+="			<rotation px=\""+Rotation.x+"\" py=\""+Rotation.y+"\" pz=\""+Rotation.z+"\" />\n";
					content+="			<scale px=\""+Scale.x+"\" py=\""+Scale.y+"\" pz=\""+Scale.z+"\" />\n";
					content+="			<texture color=\""+Texture+"\" />\n";
					content+="			\<info> "+Info+" \</info>\n";//<info>我是地板</info>
					content+="		\</MPoint>\n";

				}

			}
					content+="	\</MPointList>\n";
					content+="	\<BrandList>\n";
			for(var i=0;i<output.children.length;++i)
			{

				if(output.children[i].children[0].myModelType=="Brand")
				{
					var Id=output.children[i].myObjId;
					var Name=output.children[i].name;
					var Path=output.children[i].myObjPath;
					var Type=output.children[i].myObjType;

					var Position=getPosition(output.children[i].position,output.children[i].children[0].position);
					var Rotation=getRotation(output.children[i].rotation,output.children[i].children[0].rotation);
					var Scale=getScale(output.children[i].scale,output.children[i].children[0].scale);
					//var Texture=rgb2hex(output.children[i].children[0].myColor);
					var Texture=output.children[i].children[0].myColor.toUpperCase();
					if(output.children[i].children[0].myMap!=null)
						var Img=output.children[i].children[0].myMap.sourceFile;
					else
						var Img="";
					var Info=output.children[i].info;

					content+="		<Brand id=\""+Id+"\" name=\""+Name+"\"> \n";
					content+="			<model path=\"./data/models/"+Path+"\" type=\""+Type+"\" /> \n";
					content+="			<position px=\""+Position.x+" \" py=\""+Position.y+"\" pz=\""+Position.z+"\" />\n";
					content+="			<rotation px=\""+Rotation.x+"\" py=\""+Rotation.y+"\" pz=\""+Rotation.z+"\" />\n";
					content+="			<scale px=\""+Scale.x+"\" py=\""+Scale.y+"\" pz=\""+Scale.z+"\" />\n";
					content+="			<texture color=\""+Texture+"\" />\n";
					if(Img!="") content+="			<image path=\"./data/images/"+Img+"\" />\n";
						   else content+="			\<image path=\"\" />\n";
					content+="			\<info> "+Info+" \</info>\n";//<info>我是地板</info>
					content+="		\</Brand>\n";

				}

			}
					content+="	\</BrandList> \n";

			//Group
			content+="	\<GroupList>\n";

			for(var i=0;i<output.Groups.length;++i) {


				var name = output.Groups[i].Name;
				var list = "";
				for (var j = 0; j < output.Groups[i].Group.length; ++j) {
					list += output.Groups[i].Group[j].name;
					list +=" ;";
				}
				//var Info=output.children[i].info;
				var Info = "默认分组,默认分组,";


				var Id = output.Groups[i].Id;;
				content += "		<Group id=\"" + Id + "\" name=\"" + name + "\"" + " list=\"" + list+"\" info=\"" +Info+ "\"\</Group>\n";
					//for (var i = 0; i < output.Groups.length; ++i) {	}


			}
			content += "	\</GroupList> \n";
			content += "\</Floor>";

			exportString(content);

		}
	);
	options.add( option );

	options.add( new UI.HorizontalRule() );

	// Export Geometry

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export Geometry' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		var output = geometry.toJSON();
		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		exportString( output );

	} );
	options.add( option );

	// Export Object

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export Object' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected' );
			return;

		}

		var output = object.toJSON();
		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		exportString( output );

	} );
	options.add( option );

	// Export OBJ

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export OBJ' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		var exporter = new THREE.OBJExporter();

		exportString( exporter.parse( geometry ) );

	} );
	options.add( option );

	// Export STL

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export STL' );
	option.onClick( function () {

		var exporter = new THREE.STLExporter();

		exportString( exporter.parse( editor.scene ) );

	} );
	options.add( option );


	var exportString = function ( output ) {

		//var blob = new Blob( [ output ], { type: 'text/plain' } );
		var blob = new Blob( [ "\ufeff" +output ], { type: 'text/plain ; charset=utf8' } );
		var objectURL = URL.createObjectURL( blob );

		window.open( objectURL, '_blank' );
		window.focus();

	};

	return container;

};
