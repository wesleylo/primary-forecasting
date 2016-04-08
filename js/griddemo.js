var count2 = 0;
var grid1;
var grid2;

//highlightRow and highlight are used to show a visual feedback. If the row has been successfully modified, it will be highlighted in green. Otherwise, in red
function highlightRow(rowId, bgColor, after)
{
	var rowSelector = $("#" + rowId);
	rowSelector.css("background-color", bgColor);
	rowSelector.fadeTo("normal", 0.5, function() { 
		rowSelector.fadeTo("fast", 1, function() { 
			rowSelector.css("background-color", '');
		});
	});
}

function highlight(div_id, style) {
	highlightRow(div_id, style == "error" ? "#e5afaf" : style == "warning" ? "#ffcc00" : "#8dc70a");
}
        
/**
   updateCellValue calls the PHP script that will update the database. 
 */
function updateCellValue(editableGrid, rowIndex, columnIndex, oldValue, newValue, row, onResponse)
{      
	var id = "demo";
	var s_delegates = editableGrid.getValueAt(rowIndex, 3);
	if (columnIndex === 4 && count2 < 1) { //given hillary vote
		count2 += 1; //stop infinite loop
		
		if (newValue == 0) {
			editableGrid.setValueAt(rowIndex, 5, 0, onResponse);
			updateCellValue(editableGrid, rowIndex, 5, 0.0, 0.0, row, onResponse);
			
			editableGrid.setValueAt(rowIndex, 6, 0, onResponse);
			updateCellValue(editableGrid, rowIndex, 6, 0.0, 0.0, row, onResponse);
			
			editableGrid.setValueAt(rowIndex, 7, 0, onResponse);
			updateCellValue(editableGrid, rowIndex, 7, 0.0, 0.0, row, onResponse);
			
			editableGrid.refreshGrid();
		} else {
			editableGrid.setValueAt(rowIndex, 5, Math.round(s_delegates * (editableGrid.getValueAt(rowIndex, 4)/100)), onResponse); //calc hillary del
			updateCellValue(editableGrid, rowIndex, 5, 0.0, Math.round(s_delegates * (editableGrid.getValueAt(rowIndex, 4)/100)), row, onResponse);
		
			editableGrid.setValueAt(rowIndex, 6, 100-newValue, onResponse); //calc bernie votes
			updateCellValue(editableGrid, rowIndex, 6, 0.0, 100-newValue, row, onResponse);
			
			editableGrid.setValueAt(rowIndex, 7, Math.round(s_delegates * (editableGrid.getValueAt(rowIndex, 6)/100)), onResponse); //calc bernie del
			updateCellValue(editableGrid, rowIndex, 7, 0.0, Math.round(s_delegates * (editableGrid.getValueAt(rowIndex, 6)/100)), row, onResponse);
		}
		count2 = 0;
	} 
	if (columnIndex === 6 && count2 < 1) { //given bernie vote
		count2 += 1;

		if (newValue == 0) {
			editableGrid.setValueAt(rowIndex, 4, 0, onResponse);
			updateCellValue(editableGrid, rowIndex, 4, 0.0, 0.0, row, onResponse);
			
			editableGrid.setValueAt(rowIndex, 5, 0, onResponse);
			updateCellValue(editableGrid, rowIndex, 5, 0.0, 0.0, row, onResponse);
			
			editableGrid.setValueAt(rowIndex, 7, 0, onResponse);
			updateCellValue(editableGrid, rowIndex, 7, 0.0, 0.0, row, onResponse);
		
			editableGrid.refreshGrid();
		} else {
			editableGrid.setValueAt(rowIndex, 4, 100-newValue, onResponse); //calc hillary vote
			updateCellValue(editableGrid, rowIndex, 4, 0.0, 100-newValue, row, onResponse);
			
			editableGrid.setValueAt(rowIndex, 5, Math.round(s_delegates * (editableGrid.getValueAt(rowIndex, 4)/100)), onResponse); //calc hillary del
			updateCellValue(editableGrid, rowIndex, 5, 0.0, Math.round(s_delegates * (editableGrid.getValueAt(rowIndex, 4)/100)), row, onResponse);
			
			editableGrid.setValueAt(rowIndex, 7, Math.round(s_delegates * (editableGrid.getValueAt(rowIndex, 6)/100)), onResponse); //calc bernie del
			updateCellValue(editableGrid, rowIndex, 7, 0.0, Math.round(s_delegates * (editableGrid.getValueAt(rowIndex, 6)/100)), row, onResponse);
		}
		count2 = 0;
	}
	$.ajax({
		url: 'update.php',
		type: 'POST',
		dataType: "html",
	   		data: {
			tablename : id,
			id: editableGrid.getRowId(rowIndex), 
			newvalue: editableGrid.getColumnType(columnIndex) == "boolean" ? (newValue ? 1 : 0) : newValue, 
			colname: editableGrid.getColumnName(columnIndex),
			coltype: editableGrid.getColumnType(columnIndex)			
		},
		success: function (response) 
		{ 
			// reset old value if failed then highlight row
			var success = onResponse ? onResponse(response) : (response == "ok" || !isNaN(parseInt(response))); // by default, a sucessfull reponse can be "ok" or a database id 
			if (!success) editableGrid.setValueAt(rowIndex, columnIndex, oldValue);
		    highlight(row.id, success ? "ok" : "error"); 
		},
		error: function(XMLHttpRequest, textStatus, exception) { alert("Ajax failure\n" + errortext); },
		async: true
	});
	
	
	if (count2 < 1) {
		//calc winner value
		
		var hc_del = editableGrid.getValueAt(rowIndex, 5);
		var bs_del = editableGrid.getValueAt(rowIndex, 7);
		if (hc_del  > bs_del) { //clinton wins
			count2 += 1;
			editableGrid.setValueAt(rowIndex, 8, -1, onResponse);
			updateCellValue(editableGrid, rowIndex, 8, 0.0, -1, row, onResponse);
		} else if (hc_del  < bs_del) { //sanders wins
			count2 += 1;
			editableGrid.setValueAt(rowIndex, 8, 1, onResponse);
			updateCellValue(editableGrid, rowIndex, 8, 0.0, 1, row, onResponse);
		} else if (hc_del == 0 && bs_del == 0) { //undecided
			count2 += 1;
			editableGrid.setValueAt(rowIndex, 8, 0, onResponse);
			updateCellValue(editableGrid, rowIndex, 8, 0.0, 0, row, onResponse);
		} else if (hc_del == bs_del) { //tie
			count2 += 1;
			var rand = Math.round(Math.random());
			if (rand == 0) rand = -1;
			editableGrid.setValueAt(rowIndex, 8, rand, onResponse);
			updateCellValue(editableGrid, rowIndex, 8, 0.0, rand, row, onResponse);
		}
		count2 = 0;
		createMap(); createMap();
		
		
		var hc_totaldel = 0;
		var bs_totaldel = 0;
		var id;
		if (rowIndex < 33) id = "demo1_";
		else id = "demo2_";
		for (var i = 0; i < editableGrid.getRowCount(); i++) {
			//fix bug where cell is blank when entering 0. still is blank when clicking off of textbox or pressing enter in textbox while value is unchanged
			var hc = document.getElementById(id + (i+1)).getElementsByClassName("editablegrid-hc_votes")[0];
			var bs = document.getElementById(id + (i+1)).getElementsByClassName("editablegrid-bs_votes")[0];
			if (hc.innerHTML == "" || hc.innerHTML == "0" || hc.innerHTML == "00") {
				hc.innerHTML = "0.0";
			}
			if (bs.innerHTML == "" || bs.innerHTML == "0" || hc.innerHTML == "00") {
				bs.innerHTML = "0.0";
			}
			
			//total delegates
			hc_totaldel += editableGrid.getValueAt(i, 5);
			bs_totaldel += editableGrid.getValueAt(i, 7);
		}
		//document.getElementById("hc-totaldel").innerHTML = hc_totaldel;
		//document.getElementById("bs-totaldel").innerHTML = bs_totaldel;
		document.getElementsByClassName("progress-bar")[0].style.width = "" + hc_totaldel/23.83 + "%";
		document.getElementsByClassName("progress-bar")[0].innerHTML = "" + hc_totaldel + "/2383";
		document.getElementsByClassName("progress-bar")[1].style.width = "" + bs_totaldel/23.83 + "%";
		document.getElementsByClassName("progress-bar")[1].innerHTML = "" + bs_totaldel + "/2383";
	}
}
   



function DatabaseGrid() 
{ 
	$.ajax({
		url: 'dbinsert.php', //resets db to default
		type: 'POST',
	});
	
	this.editableGrid = new EditableGrid("demo1", {
		pageSize: 50,
		enableSort: false,
   	    	tableLoaded: function() { this.renderGrid("tablecontent1", "testgrid"); 
   	    	},
		modelChanged: function(rowIndex, columnIndex, oldValue, newValue, row) {
   	    	updateCellValue(grid1, rowIndex, columnIndex, oldValue, newValue, row);
       	}
 	});
	this.fetchGrid();this.fetchGrid();this.fetchGrid();//make sure data is loaded
	grid1 = this.editableGrid;
	this.filtergrid1 = this.editableGrid;
	
	this.editableGrid = new EditableGrid("demo2", {
		pageSize: 50,
		enableSort: false,
   	    	tableLoaded: function() { this.renderGrid("tablecontent2", "testgrid"); },
		modelChanged: function(rowIndex, columnIndex, oldValue, newValue, row) {
   	    	updateCellValue(grid2, rowIndex, columnIndex, oldValue, newValue, row);
       	}
 	});
	this.fetchGrid();this.fetchGrid();this.fetchGrid();
	grid2 = this.editableGrid;
	this.filtergrid2 = this.editableGrid;
}

DatabaseGrid.prototype.fetchGrid = function()  {
	// call a PHP script to get the data
	this.editableGrid.loadJSON("loaddata.php?db_tablename=demo");
};

DatabaseGrid.prototype.initializeGrid = function(grid) {
	var self = this;

// render for the action column
	grid.setCellRenderer("action", new CellRenderer({ 
		render: function(cell, id) {                 
		      cell.innerHTML+= "<i onclick=\"datagrid.deleteRow("+id+");\" class='fa fa-trash-o red' ></i>";
		}
	})); 


	grid.renderGrid("tablecontent", "testgrid");
};    