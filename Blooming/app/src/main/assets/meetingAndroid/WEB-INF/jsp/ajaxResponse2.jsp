<%@ page contentType="text/html;charset=UTF-8" language="java"%><% if ( request.getAttribute("responseText") != null ) {
     out.write( request.getAttribute("responseText").toString() ); 
   }%>