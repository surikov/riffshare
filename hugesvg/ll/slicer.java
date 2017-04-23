package svg.tile;

import java.io.*;
import java.util.*;
import tee.binding.*;
import tee.binding.it.*;

class SVGText {
	String text = "";
	double x = 0;
	double y = 0;
	double size = 10;
	String fill = "";
	public SVGText(Bough data) {
		//System.out.println(data.child("text").dumpXML());
		text = data.child("text").value.property.value();
		x = Numeric.string2double(data.child("text").child("x").value.property.value());
		y = Numeric.string2double(data.child("text").child("y").value.property.value());
		size = Numeric.string2double(data.child("text").child("font-size").value.property.value());
		fill = data.child("text").child("fill").value.property.value();
		//System.out.println(x+"x"+y+": "+size+" - "+text);
	}
}

class XY {
	double x = 0;
	double y = 0;
	public XY(double x, double y) {
		this.x = x;
		this.y = y;
	}
}

class SVGPathCommand {
	String kind = "";
	Vector<XY> xy = new Vector<XY>();
	public SVGPathCommand(String kind) {
		this.kind = kind;
	}
}

class SVGPath {
	String fill = "none";
	String stroke = "#ff00ff";
	String strokeWidth = "0.99";
	Vector<SVGPathCommand> commands = new Vector<SVGPathCommand>();
	public boolean consists(double minX, double minY, double maxX, double maxY) {
		if (commands.size() > 0) {
			if (commands.get(0).xy.size() > 0) {
				if (commands.get(0).xy.get(0).x >= minX//
						&& commands.get(0).xy.get(0).x < maxX//
						&& commands.get(0).xy.get(0).y >= minY//
						&& commands.get(0).xy.get(0).y < maxY//
				) {
					return true;
				}
			}
		}
		return false;
	}
	public String compose12(double shiftX, double shiftY) {
		String t = "<path d=\"";
		for (int c = 0; c < this.commands.size(); c++) {
			t = t + this.commands.get(c).kind;
			for (int s = 0; s < this.commands.get(c).xy.size(); s++) {
				if (this.commands.get(c).kind.equals(this.commands.get(c).kind.toUpperCase())) {
					t = t + (this.commands.get(c).xy.get(s).x + shiftX) + "," + (this.commands.get(c).xy.get(s).y + shiftY) + " ";
				}
				else {
					t = t + this.commands.get(c).xy.get(s).x + "," + this.commands.get(c).xy.get(s).y + " ";
				}
			}
		}
		t = t.trim();
		t = t + "\" />\n";
		return t;
	}
	public SVGPath(Bough data, String version) {
		if (version.equals("1.1")) {
			SVGPath11(data);
		}
		else {
			SVGPath12(data);
		}
	}
	public void SVGPath12(Bough data) {
		fill = data.child("path").child("fill").value.property.value();
		stroke = data.child("path").child("stroke").value.property.value();
		strokeWidth = data.child("path").child("stroke-width").value.property.value();
		String d = data.child("path").child("d").value.property.value();
		//System.out.println(d);
		String[] splited = d.split("\\s+");
		//commands.add(new SVGPathCommand(splited[0].substring(0,1)));
		int cntr = 0;
		//SVGPathCommand current=new SVGPathCommand(splited[0]);
		//String c="";
		//double x=0;
		//double y=0;
		while (cntr < splited.length) {
			String word = splited[cntr];
			if (word.toUpperCase().startsWith("M")//
					| word.toUpperCase().startsWith("Z")//
					| word.toUpperCase().startsWith("L")//
					| word.toUpperCase().startsWith("H")//
					| word.toUpperCase().startsWith("V")//
					| word.toUpperCase().startsWith("C")//
					| word.toUpperCase().startsWith("S")//
					| word.toUpperCase().startsWith("Q")//
					| word.toUpperCase().startsWith("T")//
					| word.toUpperCase().startsWith("A")//
			) {
				String kind = word.substring(0, 1);
				//System.out.println("("+kind+")");
				commands.add(new SVGPathCommand(kind));
				word = word.substring(1);
				String[] plot = word.split(",");
				commands.get(commands.size() - 1).xy.add(//
						new XY(Numeric.string2double(plot[0])//
								, Numeric.string2double(plot[1])//
						));
				cntr++;
			}
			else {
				String[] plot = word.split(",");
				commands.get(commands.size() - 1).xy.add(//
						new XY(Numeric.string2double(plot[0])//
								, Numeric.string2double(plot[1])//
						));
				cntr++;
			}
		}
		/*for (int i = 0; i < commands.size(); i++) {
			System.out.print("["+commands.get(i).kind+"]");
			for (int n = 0; n < commands.get(i).xy.size(); n++) {
				System.out.print("|" + commands.get(i).xy.get(n).x + "x" + commands.get(i).xy.get(n).y);
			}
			System.out.print(",");
		}
		System.out.println("");*/
	}
	public void SVGPath11(Bough data) {
		fill = data.child("path").child("fill").value.property.value();
		stroke = data.child("path").child("stroke").value.property.value();
		strokeWidth = data.child("path").child("stroke-width").value.property.value();
		String d = data.child("path").child("d").value.property.value();
		//System.out.println(d);
		String[] splited = d.split("\\s+");
		commands.add(new SVGPathCommand(splited[0]));
		int cntr = 1;
		//SVGPathCommand current=new SVGPathCommand(splited[0]);
		//String c="";
		//double x=0;
		//double y=0;
		while (cntr < splited.length) {
			if (splited[cntr].toUpperCase().equals("M")//
					| splited[cntr].toUpperCase().equals("Z")//
					| splited[cntr].toUpperCase().equals("L")//
					| splited[cntr].toUpperCase().equals("H")//
					| splited[cntr].toUpperCase().equals("V")//
					| splited[cntr].toUpperCase().equals("C")//
					| splited[cntr].toUpperCase().equals("S")//
					| splited[cntr].toUpperCase().equals("Q")//
					| splited[cntr].toUpperCase().equals("T")//
					| splited[cntr].toUpperCase().equals("A")//
			) {
				commands.add(new SVGPathCommand(splited[cntr]));
				cntr++;
			}
			else {
				//x= Numeric.string2double(splited[cntr]);;
				commands.get(commands.size() - 1).xy.add(//
						new XY(Numeric.string2double(splited[cntr])//
								, Numeric.string2double(splited[cntr + 1])//
						));
				cntr = cntr + 2;
			}
		}
		/*for (int i = 0; i < commands.size(); i++) {
			System.out.print(commands.get(i).kind);
			for (int n = 0; n < commands.get(i).xy.size(); n++) {
				System.out.print("|" + commands.get(i).xy.get(n).x + "x" + commands.get(i).xy.get(n).y);
			}
			System.out.print(",");
		}
		System.out.println("");*/
	}
}

class SVGPolyline {
	Vector<XY> xy = new Vector<XY>();
	String fill = "none";
	String stroke = "#ff00ff";
	String strokeWidth = "0.99";
	boolean cutH = false;
	boolean cutV = false;
	public boolean consists(double minX, double minY, double maxX, double maxY) {
		if (this.xy.size() == 2) {
			if (this.xy.get(0).x == this.xy.get(1).x && this.xy.get(0).x >= minX && this.xy.get(1).x < maxX) {
				if (this.xy.get(0).y < maxY && this.xy.get(1).y >= minY) {
					cutV = true;
					return true;
				}
			}
			if (this.xy.get(0).y == this.xy.get(1).y && this.xy.get(0).y >= minY && this.xy.get(1).y < maxY) {
				if (this.xy.get(0).x < maxX && this.xy.get(1).x >= minX) {
					cutH = true;
					
					return true;
				}
			}
		}
		if (this.xy.size() > 0) {
			if (this.xy.get(0).x >= minX//
					&& this.xy.get(0).x < maxX//
					&& this.xy.get(0).y >= minY//
					&& this.xy.get(0).y < maxY//
			) {
				return true;
			}
		}
		return false;
	}
	public String compose12(double shiftX, double shiftY, double minX, double minY, double maxX, double maxY) {
		String t = "<polyline points=\"";
		if (cutV) {
			XY from = new XY(this.xy.get(0).x,this.xy.get(0).y);
			XY to = new XY(this.xy.get(1).x,this.xy.get(1).y);
			if (from.y < minY) {
				from.y = minY;
			}
			if (to.y >= maxY) {
				to.y = maxY - 1;
			}
			t = t + (from.x + shiftX) + "," + (from.y + shiftY) + " ";
			t = t + (to.x + shiftX) + "," + (to.y + shiftY) + " ";
		}
		else {
			if (cutH) {
				XY from = new XY(this.xy.get(0).x,this.xy.get(0).y);
				XY to = new XY(this.xy.get(1).x,this.xy.get(1).y);
				if (from.x < minX) {
					from.x = minX;
				}
				if (to.x >= maxX) {
					to.x = maxX - 1;
				}
				t = t + (from.x + shiftX) + "," + (from.y + shiftY) + " ";
				t = t + (to.x + shiftX) + "," + (to.y + shiftY) + " ";
				//System.out.println(this.xy.get(0).x+"x"+this.xy.get(0).y+" > "+this.xy.get(1).x+"x"+this.xy.get(1).y+" "+t);
			}
			else {
				for (int c = 0; c < this.xy.size(); c++) {
					t = t + (this.xy.get(c).x + shiftX) + "," + (this.xy.get(c).y + shiftY) + " ";
				}
			}
		}
		t = t.trim()+"\"";
		t = t + " fill=\"" + this.fill + "\" stroke=\"" + this.stroke + "\" stroke-width=\"" + this.strokeWidth + "\" />\n";
		return t;
	}
	public SVGPolyline(Bough data) {
		fill = data.child("polyline").child("fill").value.property.value();
		stroke = data.child("polyline").child("stroke").value.property.value();
		strokeWidth = data.child("polyline").child("stroke-width").value.property.value();
		String points = data.child("polyline").child("points").value.property.value();
		//System.out.println(points);
		String[] splited = points.split("\\s+");
		for (int i = 0; i < splited.length; i++) {
			String[] dd = splited[i].split(",");
			xy.add(new XY(Numeric.string2double(dd[0]), Numeric.string2double(dd[1])));
		}
	}
}

public class slicer {
	public static void main(String[] args) {
		showUsage();
		try {
			int sz = 199;
			if (args.length > 1) {
				sz = Integer.parseInt(args[1]);
			}
			slice(args[0], sz);
		}
		catch (Throwable t) {
			t.printStackTrace();
		}
		System.out.println("Done");
	}
	public static void showUsage() {
		System.out.println("SVG slicer v1.05");
		System.out.println("slices SVG file to tiles into current folder");
		System.out.println("usage:");
		System.out.println("java -jar svgslicer /path/file.svg 199");
		System.out.println("/path/file.svg - path to SVG file");
		System.out.println("199 - tile size");
	}
	public static Vector<String> readTextFromFile(File file) {
		return readTextFromFile(file, "UTF-8");
	}
	public static Vector<String> readTextFromFile(File file, String encoding) {
		Vector<String> result = new Vector<String>();
		try {
			//BufferedReader input = new BufferedReader(new FileReader(aFile));
			BufferedReader input = new BufferedReader(new InputStreamReader(new FileInputStream(file), encoding));
			try {
				String line = null;
				while ((line = input.readLine()) != null) {
					if (line.trim().startsWith("<")) {
						result.add(line);
					}
					else {
						if (result.size() > 0) {
							result.set(result.size() - 1, result.get(result.size() - 1) + " " + line);
						}
					}
				}
			}
			finally {
				input.close();
			}
		}
		catch (Throwable t) {
			t.printStackTrace();
		}
		return result;
	}
	public static void slice(String svgPath, int size) throws Exception {
		System.out.println("reading " + svgPath);
		File file = new File(svgPath);
		Vector<String> lines = readTextFromFile(file);
		Vector<SVGPolyline> polylines = new Vector<SVGPolyline>();
		Vector<SVGText> texts = new Vector<SVGText>();
		Vector<SVGPath> paths = new Vector<SVGPath>();
		double w = 1000.0;
		double h = 1000.0;
		String version = "1.0";
		Bough svgRoot = null;
		Bough b;
		String s;
		for (int i = 0; i < lines.size(); i++) {
			if (lines.get(i).trim().startsWith("<svg")) {
				s = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><s>" + lines.get(i) + "</svg></s>";
				svgRoot = Bough.parseXML(s);
				//String wText=svgRoot.child("svg").child("width").value.property.value();
				w = Numeric.string2double(svgRoot.child("svg").child("width").value.property.value());
				//String hText=svgRoot.child("svg").child("height").value.property.value();
				h = Numeric.string2double(svgRoot.child("svg").child("height").value.property.value());
				version = svgRoot.child("svg").child("version").value.property.value();
				System.out.println("size: " + w + "x" + h + ", version: " + version);
				System.out.println("tiles: " + (int)Math.ceil(w/size) + "x" + (int)Math.ceil(h/size) + "/" + size);
				
			}
			if (lines.get(i).trim().startsWith("<text")) {
				s = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><s>" + lines.get(i) + "</s>";
				b = Bough.parseXML(s);
				texts.add(new SVGText(b));
			}
			if (lines.get(i).trim().startsWith("<path")) {
				s = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><s>" + lines.get(i) + "</s>";
				b = Bough.parseXML(s);
				paths.add(new SVGPath(b, version));
			}
			if (lines.get(i).trim().startsWith("<polyline")) {
				s = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><s>" + lines.get(i) + "</s>";
				b = Bough.parseXML(s);
				polylines.add(new SVGPolyline(b));
			}
		}
		System.out.println("statistics: texts " + texts.size() + " / paths " + paths.size() + " / lines " + polylines.size());
		if (version.equals("1.1")) {
			write11(w, h, texts, paths);
		}
		else {
			write12(w, h, polylines, paths);
			//slise12part(w, h, polylines, paths, 100, 200, 300, 500);
			int x = 0;
			while (x * size < w) {
				int y = 0;
				while (y * size < h) {
					String name = "tile" + x + "x" + y + ".svg";
					System.out.println("slice "+ x + "x" + y);
					slise12part(name, polylines, paths, x*size, y*size, x*size+size, y*size+size);
					y++;
				}
				x++;
			}
			x = 0;
			int s2=size;
			while (x * s2 < w) {
				int y = 0;
				while (y * s2 < h) {
					String name = "sub" + x + "x" + y + ".svg";
					//System.out.println("slice "+ x + "x" + y);
					slise12sub(name, polylines, paths, x*s2, y*s2, x*s2+s2, y*s2+s2);
					y++;
				}
				x++;
			}
		}
		System.out.println("statistics: texts " + texts.size() + " / paths " + paths.size() + " / lines " + polylines.size());
		System.out.println("size: " + w + "x" + h + ", version: " + version);
		System.out.println("tiles: " + (int)Math.ceil(w/size) + "x" + (int)Math.ceil(h/size) + "/" + size);
		
	}
	public static void write12(double w, double h, Vector<SVGPolyline> polylines, Vector<SVGPath> paths) throws Exception {
		File strip = new File("strip.svg.html");
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(strip));
		bufferedWriter.write("<html><body>\n");
		bufferedWriter.write("<svg width=\"" + w + "px\" height=\"" + h + "px\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.2\" baseProfile=\"tiny\">\n");
		for (int i = 0; i < paths.size(); i++) {
			/*String t = "<path d=\"";
			for (int c = 0; c < paths.get(i).commands.size(); c++) {
				t = t + paths.get(i).commands.get(c).kind;
				for (int s = 0; s < paths.get(i).commands.get(c).xy.size(); s++) {
					t = t + paths.get(i).commands.get(c).xy.get(s).x + "," + paths.get(i).commands.get(c).xy.get(s).y + " ";
				}
			}
			t = t.trim();
			t = t + "\"/>\n";
			*/
			bufferedWriter.write(paths.get(i).compose12(0, 0));
		}
		for (int i = 0; i < polylines.size(); i++) {
			/*String t = "<polyline points=\"";
			for (int c = 0; c < polylines.get(i).xy.size(); c++) {
				t = t + polylines.get(i).xy.get(c).x + "," + polylines.get(i).xy.get(c).y + " ";
			}
			t = t.trim();
			t = t + " fill=\"" + polylines.get(i).fill + "\" stroke=\"" + polylines.get(i).stroke + "\" stroke-width=\"" + polylines.get(i).strokeWidth + "\"/>\n";
			*/
			bufferedWriter.write(polylines.get(i).compose12(0, 0, 0, w, 0, h));
		}
		bufferedWriter.write("</svg>\n");
		bufferedWriter.write("</body></html>");
		bufferedWriter.close();
	}
	public static void slise12part(String name, Vector<SVGPolyline> polylines, Vector<SVGPath> paths, double minX, double minY, double maxX, double maxY) throws Exception {
		//File strip = new File("slice.svg.html");
		File strip = new File(name);
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(strip));
		//bufferedWriter.write("<html><body>\n");
		bufferedWriter.write("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n");
		bufferedWriter.write("<svg width=\"" + (maxX - minX) + "px\" height=\"" + (maxY - minY) + "px\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.2\" baseProfile=\"tiny\">\n");
		//bufferedWriter.write("<svg width=\"" + w + "px\" height=\"" + h + "px\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.2\" baseProfile=\"tiny\">\n");
		for (int i = 0; i < paths.size(); i++) {
			if (paths.get(i).consists(minX, minY, maxX, maxY)) {
				bufferedWriter.write(paths.get(i).compose12(-minX, -minY));
			}
		}
		for (int i = 0; i < polylines.size(); i++) {
			if (polylines.get(i).consists(minX, minY, maxX, maxY)) {
				bufferedWriter.write(polylines.get(i).compose12(-minX, -minY, minX, minY, maxX, maxY));//-minX, -minY));
			}
		}
		bufferedWriter.write("</svg>\n");
		//bufferedWriter.write("</body></html>");
		bufferedWriter.close();
		//slise12sub("sub"+name,polylines, paths, minX, minY, maxX, maxY);
	}
	public static void slise12sub(String name, Vector<SVGPolyline> polylines, Vector<SVGPath> paths, double minX, double minY, double maxX, double maxY) throws Exception {
		//File strip = new File("slice.svg.html");
		File strip = new File(name);
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(strip));
		//bufferedWriter.write("<html><body>\n");
		bufferedWriter.write("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n");
		bufferedWriter.write("<svg width=\"" + (maxX - minX) + "px\" height=\"" + (maxY - minY) + "px\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.2\" baseProfile=\"tiny\">\n");
		//bufferedWriter.write("<svg width=\"" + w + "px\" height=\"" + h + "px\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.2\" baseProfile=\"tiny\">\n");
		
		for (int i = 0; i < polylines.size(); i++) {
			if (polylines.get(i).consists(minX, minY, maxX, maxY)) {
				bufferedWriter.write(polylines.get(i).compose12(-minX, -minY, minX, minY, maxX, maxY));//-minX, -minY));
			}
		}
		bufferedWriter.write("</svg>\n");
		//bufferedWriter.write("</body></html>");
		bufferedWriter.close();
		
	}
	public static void write11(double w, double h, Vector<SVGText> texts, Vector<SVGPath> paths) throws Exception {
		File strip = new File("strip.svg.html");
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(strip));
		bufferedWriter.write("<html><body>\n");
		bufferedWriter.write("<svg width=\"" + w + "px\" height=\"" + h + "px\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">\n");
		//int cntr=0;
		for (int i = 0; i < paths.size(); i++) {
			String t = "<path d=\"";
			for (int c = 0; c < paths.get(i).commands.size(); c++) {
				t = t + paths.get(i).commands.get(c).kind + " ";
				for (int s = 0; s < paths.get(i).commands.get(c).xy.size(); s++) {
					t = t + paths.get(i).commands.get(c).xy.get(s).x + " ";
					t = t + paths.get(i).commands.get(c).xy.get(s).y + " ";
				}
			}
			t = t.trim();
			/*if (!paths.get(i).commands.get(paths.get(i).commands.size() - 1).kind.equals("Z")) {
				System.out.println("no z");
				t = t + " Z";
			}*/
			t = t + "\"";
			t = t + " fill=\"" + paths.get(i).fill + "\" stroke=\"" + paths.get(i).stroke + "\" stroke-width=\"" + paths.get(i).strokeWidth + "\"/>\n";
			bufferedWriter.write(t);
			/*cntr++;
			if(cntr>300){
				break;
			}*/
		}
		for (int i = 0; i < texts.size(); i++) {
			String t = "<text x='" + texts.get(i).x + "' y='" + texts.get(i).y + "' font-family=\"Default\" font-size=\"" + texts.get(i).size + "\" fill=\"" + texts.get(i).fill + "\" >" + texts.get(i).text + "</text>";
			t = t + "\n";
			bufferedWriter.write(t);
		}
		bufferedWriter.write("</svg>\n");
		bufferedWriter.write("</body></html>");
		bufferedWriter.close();
	}
}
