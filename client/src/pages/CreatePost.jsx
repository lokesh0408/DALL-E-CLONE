import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePost = () => {
  // once the post is created, we will navigate back to the home page..
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  // when we are contacting with our api, and waiting to get the image
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true); // loading state
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          // sending the data to the backend to get back the ai generated image
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();

        // now, save and render our image
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        toast.error(err);
      } finally {
        setGeneratingImg(false); // loading state
      }
    } else {
      toast.warning("Please provide a proper prompt");
    }
  };

  // for data fetching..
  const handleSubmit = async (e) => {
    // e = event
    e.preventDefault(); // browser will not reload our application by default

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        toast.success("You have successfully created the image");
        navigate("/"); // go back to home to see our image..
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please generate an image with proper details");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = (e) => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-lime-500 text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-sm max-w-[500px]">
          Generate an imaginative image through DALL-E AI and share it with the
          community
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., olive yew"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            // show an additional button with this formfield
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          {/* we are creating a place where ai generated image will be shown but also we will show the preview of the image incase image has been already generated  */}
          <div className="relative bg-gray-100 border border-amber-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-purple-300 shadow-md shadow-yellow-500/50 ... outline ring-2 ring-purple-300 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-800 ... outline-purple-500 ... font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center hover:rounded-md"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-blue-300 shadow-md shadow-yellow-500/50 ... outline outline-offset-2 outline-pink-500 ... font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center hover:rounded-md"
          >
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
