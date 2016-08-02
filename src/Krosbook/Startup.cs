using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;

using AutoMapper;

using Krosbook.Models;
using Krosbook.Models.Rooms;
using Krosbook.Models.Users;
using Krosbook.Models.Cars;
using Krosbook.ViewModels.Rooms;
using Krosbook.ViewModels.Users;
using Krosbook.ViewModels.Cars;
using Krosbook.Models.Reservation;
using Microsoft.AspNetCore.Cors.Infrastructure;

namespace Krosbook
{
    public class Startup
    {
        public const string AuthenticationScheme = "KrosbookAuthentication";

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration["ConnectionStrings:DefaultConnection"]));

            services.AddIdentity<ApplicationUser, IdentityRole>(configuration =>
            {
                //ToDo: Refaktorovat. Extrahovat do zvlast triedy, ked bude jasne ako ideme riesit autorizaciu.
                configuration.Password.RequiredLength = 8;
                configuration.Password.RequireLowercase = false;
                configuration.Password.RequireUppercase = false;
                configuration.Cookies.ApplicationCookie.Events = new CookieAuthenticationEvents()
                {
                    OnRedirectToLogin = ctx =>
                    {
                        if (ctx.Request.Path.StartsWithSegments("/api") &&
                            ctx.Response.StatusCode == (int)HttpStatusCode.OK)
                        {
                            ctx.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        }
                        else
                        {
                            ctx.Response.Redirect(ctx.RedirectUri);
                        }

                        return Task.FromResult(0);
                    }
                };
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            services.AddMvc();



            var corsBuilder = new CorsPolicyBuilder();
            corsBuilder.AllowAnyHeader();
            corsBuilder.AllowAnyMethod();
            corsBuilder.AllowAnyOrigin();
            corsBuilder.AllowCredentials();
            

            services.AddCors(options => {
                options.AddPolicy("AllowAll", corsBuilder.Build());
                });
            

            // Add application services
            AddIntraWebServices(services);

            //services.AddInstance<IRoomRepository>(new Models.Dummies.RoomDummyRepository()); //Testovacia implementacia
            InitializeAutoMapper(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseCookieAuthentication(new CookieAuthenticationOptions()
            {
                AuthenticationScheme = Startup.AuthenticationScheme,
                CookieName = "KrosbookAuth",
                ReturnUrlParameter = "returnUrl",
                SlidingExpiration = true,
                ExpireTimeSpan = TimeSpan.FromMinutes(20),
                LoginPath = "/login",
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                CookieHttpOnly = false //ak je false tak mozno editovat cookie v prehliadaci
            });

            app.UseStaticFiles();

            app.UseIdentity();

            app.UseMvc();

            app.UseCors("AllowAll");            

            app.MapWhen(context =>
            {
                var requestPath = context.Request.Path.Value;

                return !(Path.HasExtension(requestPath) && requestPath.Contains("/api/"));
            },
            branch =>
            {
                branch.Use((context, next) =>
                {
                    context.Request.Path = new PathString("/index.html");
                    return next();
                });

                branch.UseStaticFiles();
            });

            DbInitializer.Initialize(app.ApplicationServices);
        }

        private void AddIntraWebServices(IServiceCollection services)
        {
            //services.AddScoped<IEmailService, EmailService>();
            //services.AddScoped<IEmailSender, SmtpEmailSender>();
            //services.AddScoped<IEmailCreator, HtmlEmailCreator>();
            //services.AddScoped<ITemplateFormatter, TemplateFormatter>();
            //services.AddScoped<ITemplateLoader, FileTemplateLoader>(
            //    (provider) => new FileTemplateLoader(System.IO.Path.Combine(_env.WebRootPath, "templates", "email"))
            //);

            services.AddScoped<IRoomRepository, RoomRepository>();
            services.AddScoped<IEquipmentRepository, EquipmentRepository>();
            services.AddScoped<IRoomReservationRepository, RoomReservationRepository>();
            services.AddScoped<ICarReservationRepository, CarReservationRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<ICarRepository, CarRepository>();
        }

        private static void InitializeAutoMapper(IServiceCollection services)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<RoomsMappingProfile>();
                cfg.AddProfile<UsersMappingProfile>();
                cfg.AddProfile<CarsMappingProfile>();    
            });

            services.AddTransient<IMapper>(x => config.CreateMapper());
        }
    }
}
