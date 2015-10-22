Table table;
void setup() {
  
  table = loadTable("Are_We_Closing_Elementary.csv", "header");

  println(table.getRowCount() + " total rows in table"); 

  //for (TableRow row : table.rows()) {
  //  String id = row.getString("District ID");
  //  println(id);
  //  println(id == "Total ");
  //  println(row.getString(" All Students Rates"));
  //  if(id == "Total "){
  //    println(row.getString("All Students Rates"));
      
  //  }
  //}
  size(1000,500);
  background(255);
  fill(200,200,30,50);
  int x_coord = 0;
  for (TableRow row : table.rows()) {
    float perc = float(split(row.getString(" All Students Rates"),'%')[0]);
    println(row.getString(" All Students Rates") + str(perc));
    rect(x_coord, 500, 1, -perc*50);
    x_coord += 1;
  }
  
}