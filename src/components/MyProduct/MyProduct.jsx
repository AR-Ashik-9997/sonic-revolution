import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../utility/AuthProvider";
import useTitle from "../../utility/TitleHooks";
const MyProduct = () => {
  useTitle("Product Info");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const notify = () => toast.success("Delete Successful.");
  const { data: MyProduct = [], refetch } = useQuery({
    queryKey: ["MyProduct"],
    queryFn: async () => {
      const res = await fetch(
        `https://music-data-six.vercel.app/sellerProduct?email=${user.email}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("secret-token")}`,
          },
        }
      );
      const data = await res.json();
      setLoading(false);
      return data;
    },
  });
  const handleAdd = (product) => {
    const update = {
      advertise: "true",
    };
    axios({
      url: `https://music-data-six.vercel.app/update-advertisement/${product._id}`,
      method: "put",
      data: update,
    })
      .then((response) => console.log(response.data))
      .then(() => {
        refetch();
      });
  };

  const handleDelete = (product) => {
    const agree = window.confirm(
      `Are you sure you want to delete: ${product.productName}`
    );
    if (agree) {
      axios({
        method: "DELETE",
        url: `https://music-data-six.vercel.app/seller-product-delete/${product._id}`,
      })
        .then((response) => console.log(response.data))
        .then(() => {
          notify();
          refetch();
        });
    }
  };
  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }
  return (
    <Container className="pb mt-5">
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="mt-5 mb-5 bg-background">
            {MyProduct.length > 0 ? (
              <>
                <h1 className="text-center mb-4 pt-3 ">My Product</h1>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">Product Name</th>
                      <th className="text-center">Category Name</th>
                      <th className="text-center">Sell Price</th>
                      <th className="text-center">Original Price</th>
                      <th className="text-center">Posted Time</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Advertisement</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MyProduct.map((product) => (
                      <tr key={product._id}>
                        <td className="text-center">{product.productName}</td>
                        <td className="text-center">{product.category}</td>
                        <td className="text-center">$ {product.sellPrice}</td>
                        <td className="text-center">
                          $ {product.originalPrice}
                        </td>
                        <td className="text-center">{product.date}</td>
                        <td className="text-center">{product.status}</td>
                        <td className="text-center">
                          {product.addvertise === "true" &&
                          product.status !== "sold" ? (
                            <p>product is advertised</p>
                          ) : (
                            <>
                              {product.status === "sold" ? (
                                <></>
                              ) : (
                                <>
                                  {product.status !== "sold" &&
                                  product.addvertise !== "true" ? (
                                    <Button
                                      variant="dark"
                                      onClick={() => handleAdd(product)}
                                    >
                                      Advertise
                                    </Button>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="dark"
                            onClick={() => handleDelete(product)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : (
              <h1 className="text-center mt-5 mb-5">No Data available</h1>
            )}
          </div>
        </Col>
      </Row>
      <Toaster />
    </Container>
  );
};

export default MyProduct;
