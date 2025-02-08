// Create a separate file for API handler: app/api/create-order/route.js
export async function POST(req) {
    try {
      const body = await req.json();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
      });
  
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Log the error response for debugging
        const errorText = await response.text();
        console.error('Server response:', errorText);
        console.error('Response status:', response.status);
        
        return Response.json({ 
            message: `Server error: ${response.status}`,
            details: errorText
        }, { 
            status: response.status 
        }); 
      }
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      console.error('Create order error:', error);
      return Response.json({ message: 'Error creating order' }, { status: 500 });
    }
  }
  
